const workerOptions = {
    OggOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@0.8.0/OggOpusEncoder.wasm',
    WebMOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@0.8.0/WebMOpusEncoder.wasm'
};

// Polyfill MediaRecorder
window.MediaRecorder = OpusMediaRecorder;

const rootDiv = $("#root")

// MediaRecorder object
let mediaRecorder;

// space for audio element created from recording (for in-site playback)
// utilized in play-btn click listener
let audioEl;


// rootDiv.on("click", "#record-btn", ()=>{
//     console.log('clicked record')
// })
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
        // player.src = audioURL;
        link.href = audioURL;
        link.innerHTML="<button class='btn btn-primary'>download!</button>"
        let extension = '.wav'
        link.download = 'recording' + extension;
        audioElement.src = audioURL;
        console.log(audioElement.attributes.src)

        console.log('Recorder stopped');
        updateButtonState();
    };
    mediaRecorder.onpause = () => console.log('Recorder paused');
    mediaRecorder.onresume = () => console.log('Recorder resumed');
    mediaRecorder.onerror = e => console.log('Recorder encounters error:' + e.message);

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
                    : 'Stream created. Click "start" button to start recording.';
            break;
        case 'recording':
            buttonCreate.disabled = true;
            buttonStart.disabled = true;
            buttonPause.disabled = false;
            buttonResume.disabled = false;
            buttonStop.disabled = false;
            // buttonStopTracks.disabled = false; // For debugging purpose
            status.innerHTML = 'Recording. Click "stop" button to play recording.';
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
    function getStream (mediaElement) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const source = context.createMediaElementSource(mediaElement);
      const destination = context.createMediaStreamDestination();
  
      source.connect(destination);
      source.connect(context.destination);
  
      return destination.stream;
    }
    const defaultMime = document.getElementById('defaultMime')
    // When creating MediaRecorder object without mimeType option, the API will
    //  decide the default MIME Type depending on the browser running.
    let tmpRec = new MediaRecorder(
      getStream(new Audio('https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3')),
      {}, workerOptions);
    defaultMime.innerHTML = `default: ${tmpRec.mimeType} (Browser dependant)`;
  }, false);
  
  rootDiv.on('click', '#play-btn', ()=> {
      audioEl.play();
  })

// print stream information (for debugging)
// function printStreamInfo(stream) {
//     for (const track of stream.getAudioTracks()) {
//         console.log('Track Information:');
//         for (const key in track) {
//             if (typeof track[key] !== 'function') {
//                 console.log(`\t${key}: ${track[key]}`);
//             }
//         }
//         console.log('Track Settings:');
//         let settings = track.getSettings();
//         for (const key in settings) {
//             if (typeof settings[key] !== 'function') {
//                 console.log(`\t${key}: ${settings[key]}`);
//             }
//         }
//     }
// }



// ============================================================== uncomment between long lines for original 'working' content
// USER CLICKS RECORD BUTTON
// rootDiv.on("click", "#record-btn", () => {
//     console.log('clicked record')
//     // CAPTURE MICROPHONE INPUT
//     navigator.mediaDevices.getUserMedia({ audio: true, type: 'audio/wav' })
//         .then(stream => {
//             // SET UP RECORDING WITH MICROPHONE
//             mediaRecorder = new MediaRecorder(stream);

//             // START RECORDING
//             mediaRecorder.start();

//             const audioChunks = [];

//             // AUDIO IS CAPTURED IN MULTIPLE 'CHUNKS'
//             mediaRecorder.addEventListener("dataavailable", event => {
//                 // PUSH ALL AUDIO CHUNKS TO SINGLE ARRAY
//                 audioChunks.push(event.data)
//             })

//             // USER CLICKS STOP BUTTON
//             rootDiv.on("click", "#stop-btn", () => {
//                 console.log("clicked stop")
//                 // STOP RECORDING
//                 mediaRecorder.stop()
//             })

//             let audioBlob;
//             let audioURL;
//             let audio;
//             mediaRecorder.addEventListener('stop', () => {
//                 // CAPTURE RAW AUDIO DATA INFO (BLOBS)
//                 audioBlob = new Blob(audioChunks);
//                 audioURL = URL.createObjectURL(audioBlob);

//                 // CREATE AUDIO OBJECT FROM CAPTURED BLOBS
//                 audio = new Audio(audioURL);
//                 console.log("audioBlob: ", audioBlob)
//                 console.log("audioURL: ", audioURL)
//                 console.log("audio: ", audio)
// ===================================================================

                // // CREATE AUDIO PROCESSING CONTEXT AND FILTERS
                // const context = new AudioContext();
                // const audioSource = context.createMediaElementSource(audio);

                // // ANALYSER WILL BE USED FOR VISUALIZATIONS AND INFO OUTPUT I THINK
                // const analyser = context.createAnalyser();

                // // SEPARATE STEREOPANNERS FOR EACH SIDE
                // const rightEar = context.createStereoPanner();
                // const leftEar = context.createStereoPanner();
                // // SET PANNERS TO RESPECTIVE SIDES
                // rightEar.pan.value = 1 // full right side pan
                // leftEar.pan.value = -1 // full left side pan

                // analyser.fftSize = 2048;
                // const bufferLength = analyser.frequencyBinCount;
                // const dataArray = new Uint8Array(bufferLength);
                // analyser.getByteTimeDomainData(dataArray);
                // analyser.minDecibels = -40;
                // analyser.maxDecibels = 120;

                // GET CANVAS FOR ISCILLOSCOPE
                // const canvas = document.getElementById('oscilloscope');
                // const canvasCtx = canvas.getContext("2d");

                // draw an oscilloscope of the current audio source

                // function draw() {
                //     // console.log(dataArray);

                //     requestAnimationFrame(draw);

                //     analyser.getByteTimeDomainData(dataArray);

                //     canvasCtx.fillStyle = "rgb(200, 200, 200)";
                //     canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                //     canvasCtx.lineWidth = 2;
                //     canvasCtx.strokeStyle = "red";

                //     canvasCtx.beginPath();

                //     var sliceWidth = canvas.width * 1.0 / bufferLength;
                //     var x = 0;

                //     for (var i = 0; i < bufferLength; i++) {

                //         var v = dataArray[i] / 128.0;
                //         var y = v * canvas.height / 2;

                //         if (i === 0) {
                //             canvasCtx.moveTo(x, y);
                //         } else {
                //             canvasCtx.lineTo(x, y);
                //         }

                //         x += sliceWidth;
                //     }

                //     canvasCtx.lineTo(canvas.width, canvas.height / 2);
                //     canvasCtx.stroke();
                // }

                // const filter1 = context.createBiquadFilter();
                // const filter2 = context.createBiquadFilter();
                // const filter3 = context.createBiquadFilter();
                // const filter4 = context.createBiquadFilter();
                // const filter5 = context.createBiquadFilter();
                // const filter6 = context.createBiquadFilter();
                // const filter7 = context.createBiquadFilter();

                // const filterArr = [filter1, filter2, filter3, filter4, filter5, filter6, filter7]

                // filterArr.forEach((filter, index) => {

                //     let hertz,
                //         gainVal;

                //     switch (index){
                //         case 0:
                //             hertz=125;
                //             gainVal=eqValsObj.hz125;
                //             break;

                //         case 1:
                //             hertz=250;
                //             gainVal=eqValsObj.hz250;
                //             break;

                //         case 2:
                //             hertz=500;
                //             gainVal=eqValsObj.hz500;
                //             break;

                //         case 3:
                //             hertz=1000;
                //             gainVal=eqValsObj.hz1000;
                //             break;

                //         case 4:
                //             hertz=2000;
                //             gainVal=eqValsObj.hz2000;
                //             break;

                //         case 5:
                //             hertz=4000;
                //             gainVal=eqValsObj.hz4000;
                //             break;

                //         default:
                //             hertz=8000;
                //             gainVal=eqValsObj.hz8000;
                //             break;
                //     }
                //     // CONNECT THE MediaElementAudioSourceNode TO THE FILTERS/PANNERS
                //     // AND THE FILTERS/PANNERS TO THE DESTINATION  
                //     audioSource.connect(filter);
                //     filter.connect(context.destination);
                //     // CONFIGURE FILTERS
                //     filter.type = 'peaking';
                //     filter.frequency.value = hertz;
                //     filter.Q.value = 100;
                //     filter.gain.value = gainVal;
                // })

                // audioSource.connect(rightEar);
                // audioSource.connect(leftEar);

                // rightEar.connect(context.destination);
                // leftEar.connect(context.destination);

                // console.log("filter after:/n", "=======================");
                // console.log(filter1, filter2, filter7);
                // console.log(analyser);
                // draw();
// =========================================== uncomment below for original 'working' content
//             })

//             // USER CLICKS PLAY BUTTON
//             rootDiv.on("click", "#play-btn", () => {
//                 console.log('clicked play')
//                 audio.play();
//             })
//         })
// })
