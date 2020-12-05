const workerOptions = {
    OggOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@0.8.0/OggOpusEncoder.wasm',
    WebMOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@0.8.0/WebMOpusEncoder.wasm'
};

// Polyfill MediaRecorder
window.MediaRecorder = OpusMediaRecorder;

const rootDiv = $("#root")

// MediaRecorder object
let mediaRecorder;

// Global variable to hold audio object for React State
let audioFile;

// space for audio element created from recording (for in-site playback)
// utilized in play-btn click listener
let audioEl;

console.log('navigator.mediaDevices: ', navigator.mediaDevices)
console.log('audiotool connected')

// USER CLICKS CREATE BUTTON
rootDiv.on("click", "#create-btn", () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                console.log('stop the recorder first');
                throw new Error('stop the recorder first');
            }
            return stream;
        })
        .then((stream) => createMediaRecorder(stream))
        .catch(e => {
            console.log(`MediaRecorder is failed: ${e.message}`);
            Promise.reject(new Error());
        })
        // .then(printStreamInfo) // Just for debugging purpose.
        .then(_ => console.log('Creating MediaRecorder is successful.'))
        .then(initButtons)
        .then(updateButtonState);
})

function createMediaRecorder(stream) {
    // Create recorder object
    let options = { mimeType: 'audio/wav' };
    mediaRecorder = new MediaRecorder(stream, options, workerOptions);

    let dataChunks = [];
    // Recorder Event Handlers
    mediaRecorder.onstart = () => {
        dataChunks = [];

        console.log('Recorder started');
        updateButtonState();
    };
    mediaRecorder.ondataavailable = (e) => {
        dataChunks.push(e.data);

        console.log('Recorder data available');
        updateButtonState();
    };
    mediaRecorder.onstop = (e) => {
        const link = document.getElementById('download-link')
        const audioElement = document.getElementById('audio-elem')
        // When stopped add a link to the player and the download link
        let blob = new Blob(dataChunks, { 'type': 'audio/wav' });
        dataChunks = [];
        let audioURL = URL.createObjectURL(blob);
        audioEl = new Audio(audioURL)
        link.href = audioURL;
        link.innerHTML="<button class='btn btn-dark'>Download</button>"
        audioElement.src = audioURL;

        // set audio data to global var for access in react app
        window.audioFile = blob;

        console.log(audioElement.attributes.src)

        console.log('Recorder stopped');
        updateButtonState();
    };
    mediaRecorder.onpause = () => console.log('Recorder paused');
    mediaRecorder.onresume = () => console.log('Recorder resumed');
    mediaRecorder.onerror = err => console.log('Recorder encounters error:' + err.message);

    return stream;
};


function initButtons() {
    rootDiv.on('click', '#record-btn', () => mediaRecorder.start('60000'))
    // buttonStart.onclick = _ => recorder.start(timeSlice.value);
    rootDiv.on('click', '#pause-btn', () => mediaRecorder.pause());
    rootDiv.on('click', '#resume-btn', () => mediaRecorder.resume());
    rootDiv.on('click', '#stop-btn', () => mediaRecorder.stop());
    // buttonPause.onclick = _ => recorder.pause();
    // buttonResume.onclick = _ => recorder.resume();
    // buttonStop.onclick = _ => recorder.stop();
    rootDiv.on('click', '#stoptracks-btn', _ => {
        // stop all tracks (this will delete a mic icon from a browser tab
        recorder.stream.getTracks().forEach(i => i.stop());
        console.log('Tracks (stream) stopped. click \'Create\' button to capture stream.');
    })
}

// Update state of buttons when any buttons clicked
function updateButtonState() {

    const buttonCreate = document.getElementById('create-btn');
    const buttonStart = document.getElementById('record-btn');
    const buttonStop = document.getElementById('stop-btn');
    // const buttonStopTracks = document.getElementById('stoptracks-btn')
    const status = document.getElementById('status-text');
    const link = document.getElementById('download-link');
    const buttonPause = document.getElementById('pause-btn');
    const buttonResume = document.getElementById('resume-btn');

    switch (mediaRecorder.state) {
        case 'inactive':
            buttonCreate.disabled = false;
            buttonStart.disabled = false;
            buttonPause.disabled = true;
            buttonResume.disabled = true;
            buttonStop.disabled = true;
            // buttonStopTracks.disabled = false; // For debugging purpose
            status.innerHTML =
                link.href ? 'Recording complete. You can play or download the recording below.'
                    : 'Stream created. Click the <span class="bg-danger text-light p-1"><i class="fas fa-circle"></i></span> button to start recording.';
            break;
        case 'recording':
            buttonCreate.disabled = true;
            buttonStart.disabled = true;
            buttonPause.disabled = false;
            buttonResume.disabled = false;
            buttonStop.disabled = false;
            // buttonStopTracks.disabled = false; // For debugging purpose
            status.innerHTML = 'Recording. Click <span class="bg-dark text-light p-1"><i class="fas fa-square"></i></span> button to play recording.';
            break;
        case 'paused':
            buttonCreate.disabled = true;
            buttonStart.disabled = true;
            buttonPause.disabled = true;
            buttonResume.disabled = false;
            buttonStop.disabled = false;
            // buttonStopTracks.disabled = false; // For debugging purpose
            status.innerHTML = 'Paused. Click "resume" button.';
            break;
        default:
            // Maybe recorder is not initialized yet so just ingnore it.
            break;
    }
}

// Check platform
window.addEventListener('load', function checkPlatform () {
    // Check compatibility
    if (OpusMediaRecorder === undefined) {
      console.error('No OpusMediaRecorder found');
    } else {
      // Check available content types
      let contentTypes = [
        'audio/wave',
        'audio/wav',
        'audio/ogg',
        'audio/ogg;codecs=opus',
        'audio/webm',
        'audio/webm;codecs=opus'
      ];
      contentTypes.forEach(type => {
        console.log(type + ' is ' +
          (MediaRecorder.isTypeSupported(type)
            ? 'supported' : 'NOT supported'));
      });
    }
  
    // Check default MIME audio format for the client's platform
    // To do this, create captureStream() polyfill.
    // function getStream (mediaElement) {
    //   const AudioContext = window.AudioContext || window.webkitAudioContext;
    //   const context = new AudioContext();
    //   const source = context.createMediaElementSource(mediaElement);
    //   const destination = context.createMediaStreamDestination();
  
    //   source.connect(destination);
    //   source.connect(context.destination);
  
    //   return destination.stream;
    // }
    // const defaultMime = document.getElementById('defaultMime')
    // When creating MediaRecorder object without mimeType option, the API will
    //  decide the default MIME Type depending on the browser running.
    // let tmpRec = new MediaRecorder(
    //   getStream(new Audio('https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3')),
    //   {}, workerOptions);
    // defaultMime.innerHTML = `default audio format: <strong>${tmpRec.mimeType}</strong> (Browser dependant)`;
  }, false);
  



