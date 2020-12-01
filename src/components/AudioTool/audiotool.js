let mediaRecorder;
let audioBlob;
let audioURL;
let audio;

function record() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // SET UP RECORDING WITH MICROPHONE
            mediaRecorder = new MediaRecorder(stream);

            // START RECORDING
            mediaRecorder.start();

            const audioChunks = [];

            // AUDIO IS CAPTURED IN MULTIPLE 'CHUNKS'
            mediaRecorder.addEventListener("dataavailable", event => {
                // PUSH ALL AUDIO CHUNKS TO SINGLE ARRAY
                audioChunks.push(event.data)
            })
        })
}

function stopRecord() {
    // STOP RECORDING
    mediaRecorder.stop();
}

function playRecording(){
    audio.play();
}

mediaRecorder.addEventListener('stop', () => {
    // CAPTURE RAW AUDIO DATA INFO (BLOBS)
    audioBlob = new Blob(audioChunks);
    audioURL = URL.createObjectURL(audioBlob);

    // CREATE AUDIO OBJECT FROM CAPTURED BLOBS
    audio = new Audio(audioURL);

    // CREATE AUDIO PROCESSING CONTEXT AND FILTERS
    const context = new AudioContext();
    const audioSource = context.createMediaElementSource(audio);
    // setAudioSource(audioURL)

})


function recordAudio() {

    // CAPTURE MICROPHONE INPUT
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // // SET UP RECORDING WITH MICROPHONE
            // mediaRecorder = new MediaRecorder(stream);

            // // START RECORDING
            // mediaRecorder.start();

            // const audioChunks = [];

            // // AUDIO IS CAPTURED IN MULTIPLE 'CHUNKS'
            // mediaRecorder.addEventListener("dataavailable", event => {
            //     // PUSH ALL AUDIO CHUNKS TO SINGLE ARRAY
            //     audioChunks.push(event.data)
            // })

            // USER CLICKS STOP BUTTON
            stopBtn.on('click', () => {
                // STOP RECORDING
                mediaRecorder.stop()
            })

            let audioBlob;
            let audioURL;
            let audio;
            mediaRecorder.addEventListener('stop', () => {
                // CAPTURE RAW AUDIO DATA INFO (BLOBS)
                audioBlob = new Blob(audioChunks);
                audioURL = URL.createObjectURL(audioBlob);

                // CREATE AUDIO OBJECT FROM CAPTURED BLOBS
                audio = new Audio(audioURL);

                // CREATE AUDIO PROCESSING CONTEXT AND FILTERS
                const context = new AudioContext();
                const audioSource = context.createMediaElementSource(audio);
                setAudioSource(audioURL)

                // ANALYSER WILL BE USED FOR VISUALIZATIONS AND INFO OUTPUT I THINK
                const analyser = context.createAnalyser();

                // SEPARATE STEREOPANNERS FOR EACH SIDE
                const rightEar = context.createStereoPanner();
                const leftEar = context.createStereoPanner();
                // SET PANNERS TO RESPECTIVE SIDES
                rightEar.pan.value = 1 // full right side pan
                leftEar.pan.value = -1 // full left side pan

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

                const filter1 = context.createBiquadFilter();
                const filter2 = context.createBiquadFilter();
                const filter3 = context.createBiquadFilter();
                const filter4 = context.createBiquadFilter();
                const filter5 = context.createBiquadFilter();
                const filter6 = context.createBiquadFilter();
                const filter7 = context.createBiquadFilter();

                const filterArr = [filter1, filter2, filter3, filter4, filter5, filter6, filter7]

                filterArr.forEach((filter, index) => {

                    let hertz,
                        gainVal;

                    switch (index) {
                        case 0:
                            hertz = 125;
                            gainVal = 20;
                            // gainVal=eqValsObj.hz125;
                            break;

                        case 1:
                            hertz = 250;
                            gainVal = 20;
                            // gainVal=eqValsObj.hz250;
                            break;

                        case 2:
                            hertz = 500;
                            gainVal = 20;
                            // gainVal=eqValsObj.hz500;
                            break;

                        case 3:
                            hertz = 1000;
                            gainVal = 20;
                            // gainVal=eqValsObj.hz1000;
                            break;

                        case 4:
                            hertz = 2000;
                            gainVal = 20;
                            // gainVal=eqValsObj.hz2000;
                            break;

                        case 5:
                            hertz = 4000;
                            gainVal = 20;
                            // gainVal=eqValsObj.hz4000;
                            break;

                        default:
                            hertz = 8000;
                            gainVal = 20;
                            // gainVal=eqValsObj.hz8000;
                            break;
                    }
                    // CONNECT THE MediaElementAudioSourceNode TO THE FILTERS/PANNERS
                    // AND THE FILTERS/PANNERS TO THE DESTINATION  
                    audioSource.connect(filter);
                    filter.connect(context.destination);
                    // CONFIGURE FILTERS
                    filter.type = 'peaking';
                    filter.frequency.value = hertz;
                    filter.Q.value = 100;
                    filter.gain.value = gainVal;
                })

                audioSource.connect(rightEar);
                audioSource.connect(leftEar);

                rightEar.connect(context.destination);
                leftEar.connect(context.destination);

                // console.log("filter after:/n", "=======================");
                // console.log(filter1, filter2, filter7);
                // console.log(analyser);
                // draw();

            })

            // USER CLICKS PLAY BUTTON
            playBtn.on('click', () => {
                audio.play();
            })
        })
}

export default recordAudio
