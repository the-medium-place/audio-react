import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, } from 'react-bootstrap';
import API from '../../utils/API';
import { ReactMic } from 'react-mic';

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import OpusMediaRecorder from 'opus-media-recorder';
import MediaRecorder from 'opus-media-recorder';
import OpusMediaRecorderView from '../OpusMediaRecorderView'


// import EncoderWorker from 'worker-loader!opus-media-recorder/encoderWorker.js';
// You should use file-loader in webpack.config.js.
// See webpack example link in the above section for more detail.
// import OggOpusWasm from 'opus-media-recorder/OggOpusEncoder.wasm';
// import WebMOpusWasm from 'opus-media-recorder/WebMOpusEncoder.wasm';

//TODO: move audio recorder functionality to react -- allowing to use wave.js functionality alongside it;

import { PlayFill, PauseFill, CircleFill, SquareFill, Slash } from 'react-bootstrap-icons';

// WAVE.js TO CREATE AUDIO OSCILLOSCOPE
// import Wave from '@foobar404/wave';
// const wave = new Wave();

// CONFIG FOR OPUS-MEDIA-RECORDER
// ==============================
// const workerOptions = {
//     encoderWorkerFactory: function () {
//         return new Worker(process.env.PUBLIC_URL + '/opus-media-recorder/encoderWorker.umd.js')
//     },
//     OggOpusEncoderWasmPath: process.env.PUBLIC_URL + '/opus-media-recorder/OggOpusEncoder.wasm',
//     WebMOpusEncoderWasmPath: process.env.PUBLIC_URL + '/opus-media-recorder/WebMOpusEncoder.wasm',
// };
// // Polyfill MediaRecorder
// window.MediaRecorder = OpusMediaRecorder;

// let mediaRecorder;






export default function AudioTool({ rightEarDecibels, leftEarDecibels, profileState, fetchUserData, setShowAudioToolState }) {

    // useEffect(() => {
    //     const script = document.createElement('script');
    //     script.src = "/assets/js/audiotool.js";
    //     script.async = true;
    //     document.body.appendChild(script);
    //     return () => {
    //         document.body.removeChild(script);
    //     }
    // }, []);

    // useEffect(() => {
    //     // Check compatibility
    //     if (OpusMediaRecorder === undefined) {
    //         console.error('No OpusMediaRecorder found');
    //     } else {
    //         // Check available content types
    //         let contentTypes = [
    //             'audio/wave',
    //             'audio/wav',
    //             'audio/ogg',
    //             'audio/ogg;codecs=opus',
    //             'audio/webm',
    //             'audio/webm;codecs=opus'
    //         ];
    //         contentTypes.forEach(type => {
    //             console.log(type + ' is ' +
    //                 (MediaRecorder.isTypeSupported(type)
    //                     ? 'supported' : 'NOT supported'));
    //         });
    //     }
    // }, [])

    const [showState, setShowState] = useState(false)
    const [buttonState, setButtonState] = useState(true);
    const [fileNameState, setFileNameState] = useState('my_recording')
    const [playerShowState, setPlayerShowState] = useState(false)

    async function saveRecording() {
        console.log('save btn clicked');
        console.log('audiofile: ', window.audioFile)

        // UPLOAD AUDIO FILE TO CLOUDINARY
        const formData = new FormData()
        formData.append('file', window.audioFile);
        formData.append('upload_preset', 'xbbzgwk2');
        formData.append('resource_type', 'video');

        console.log('formData: ', formData)

        const options = {
            method: 'POST',
            body: formData,
        };

        const res = await fetch('https://api.Cloudinary.com/v1_1/zgscloud/video/upload', options)
        const fileInfo = await res.json()
        console.log(fileInfo)


        // // SAVE RESULTING URL TO DATABASE FOR USER
        const audioSaveObj = {
            audioURL: fileInfo.secure_url,
            recordingName: fileNameState,
            cloudinaryId: fileInfo.public_id,
            // audioFile: window.audioFile
        }
        console.log("audioSaveObj before save: ", audioSaveObj)
        API.saveRecording(audioSaveObj, profileState.id)
            .then(fetchUserData())

        // RELOAD USER PAGE WITH NEW INFO
        // fetchUserData();
        // window.location.reload();


    }

    function handleCreateBtnClick() {
        setButtonState(false);
        setPlayerShowState(true);

        // CREATION OF MEDIA STREAM
        // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        //     .then((stream) => {
        //         if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        //             console.log('stop the recorder first');
        //             throw new Error('stop the recorder first');
        //         }
        //         return stream;
        //     })
        //     .then((stream) => createMediaRecorder(stream))
        //     // .then(printStreamInfo) // Just for debugging purpose.
        //     .then(() => console.log('Creating MediaRecorder is successful.'))
        //     // .then(initButtons)
        //     .catch(err => console.log(err))
        //     .then(updateButtonState)
        //     .catch(e => {
        //         console.log(`MediaRecorder is failed: ${e.message}`);
        //         Promise.reject(new Error());
        //     })
    }

    // function createMediaRecorder(stream) {
    //     // Create recorder object
    //     let options = { mimeType: 'audio/wav' };
    //     mediaRecorder = new MediaRecorder(stream, options, workerOptions);

    //     let dataChunks = [];
    //     // Recorder Event Handlers
    //     mediaRecorder.onstart = () => {
    //         dataChunks = [];

    //         console.log('Recorder started');
    //         updateButtonState();
    //     };
    //     mediaRecorder.ondataavailable = (e) => {
    //         dataChunks.push(e.data);

    //         console.log('Recorder data available');
    //         updateButtonState();
    //     };
    //     mediaRecorder.onstop = (e) => {
    //         // const link = document.getElementById('download-link')
    //         // const audioElement = document.getElementById('audio-elem')
    //         // When stopped add a link to the player and the download link
    //         let blob = new Blob(dataChunks, { 'type': 'audio/wav' });
    //         // clear audio data from collection array
    //         dataChunks = [];
    //         let audioURL = URL.createObjectURL(blob);
    //         // give html audio element context
    //         // audioEl = new Audio(audioURL)
    //         // link.href = audioURL;
    //         // link.innerHTML="<button class='btn btn-dark'>Download</button>"
    //         // audioElement.src = audioURL;

    //         // set audio data to global var for access in react app
    //         window.audioFile = blob;

    //         // console.log(audioElement.attributes.src)

    //         console.log('Recorder stopped');
    //         updateButtonState();
    //     };
    //     mediaRecorder.onpause = () => console.log('Recorder paused');
    //     mediaRecorder.onresume = () => console.log('Recorder resumed');
    //     mediaRecorder.onerror = err => console.log('Recorder encounters error:' + err.message);

    //     return stream;
    // };

    // function updateButtonState() {

    //     const buttonCreate = document.getElementById('create-btn');
    //     const buttonStart = document.getElementById('record-btn');
    //     const buttonStop = document.getElementById('stop-btn');
    //     // const buttonStopTracks = document.getElementById('stoptracks-btn')
    //     const status = document.getElementById('status-text');
    //     const link = document.getElementById('download-link');
    //     const buttonPause = document.getElementById('pause-btn');
    //     const buttonResume = document.getElementById('resume-btn');

    //     status.classList.remove("d-none")
    //     // console.log(status.classList)

    //     switch (mediaRecorder.state) {
    //         case 'inactive':
    //             buttonCreate.disabled = false;
    //             buttonStart.disabled = false;
    //             buttonPause.disabled = true;
    //             buttonResume.disabled = true;
    //             buttonStop.disabled = true;
    //             // buttonStopTracks.disabled = false; // For debugging purpose
    //             status.innerHTML =
    //                 link.href ? 'Recording complete. You can play or download the recording below.'
    //                     : 'Stream created. Click the <span class="bg-danger text-light p-1"><i class="fas fa-circle"></i></span> button to start recording.';
    //             break;
    //         case 'recording':
    //             buttonCreate.disabled = true;
    //             buttonStart.disabled = true;
    //             buttonPause.disabled = false;
    //             buttonResume.disabled = false;
    //             buttonStop.disabled = false;
    //             // buttonStopTracks.disabled = false; // For debugging purpose
    //             status.innerHTML = 'Recording. Click <span class="bg-dark text-light p-1"><i class="fas fa-square"></i></span> button to play recording.';
    //             break;
    //         case 'paused':
    //             buttonCreate.disabled = true;
    //             buttonStart.disabled = true;
    //             buttonPause.disabled = true;
    //             buttonResume.disabled = false;
    //             buttonStop.disabled = false;
    //             // buttonStopTracks.disabled = false; // For debugging purpose
    //             status.innerHTML = 'Paused. Click "resume" button.';
    //             break;
    //         default:
    //             // Maybe recorder is not initialized yet so just ingnore it.
    //             break;
    //     }
    // }

    // TEST FOR REACT-MIC INTEGRATION
    const [recordState, setRecordState] = useState(false);

    function startRecording() {
        setRecordState(true);
    }

    function stopRecording() {
        setRecordState(false);
    }

    function onData(recordedBlob) {
        console.log('chunk on real-time data: \n===========\n', recordedBlob);
    }

    function onStop(recordedBlob) {
        recordedBlob.blob.type = "audio/wav"
        console.log('recordedBlob: \n==========\n', recordedBlob)

    }

    return (
        <div className="AudioTool pb-5">
            {/* <OpusMediaRecorderView
                onDataAvailable={(e) => {
                    const data = [...this.state.data, e.data];
                    this.setState({
                        data: data,
                        blob: new Blob(data)
                    })
                }}
                render={({ state, start, stop, pause, resume }) => (
                    <div>
                        <p>{state}</p>
                        <button onClick={start}>Start Recording</button>
                        <button onClick={stop}>Stop Recording</button>
                        <audio
                            src={this.state.data.length ? URL.createObjectURL(this.state.blob) : ''}
                            controls
                        />
                    </div>
                )}
            /> */}
            <Row className="d-flex">
                <Col className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => setShowAudioToolState(false)}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Col>
            </Row>
            <div className="p-2 mt-2 rounded shadow-sm bg-light">
                <Row className="mt-4">
                    <Col sm={12} className="d-flex justify-content-center flex-column text-center">
                        <h4 className="p-2 m-3" style={{ background: 'rgba(200, 0, 0, 0.4)' }}>Note: In order for the recorder to work, you must be viewing the site from secure connection.<br /> ** MAKE SURE THE WEBSITE URL SAYS 'http<strong className="text-danger">s</strong>://' **</h4>
                        <h5 className="p-2 m-3" style={{ background: 'rgba(200, 0, 0, 0.4)' }}>If you are on an iPhone, you MUST USE the native iOS Safari browser</h5>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <div className="rounded shadow pt-2 pb-2 d-flex justify-content-center flex-wrap" style={{ background: 'lightgray' }}>
                        <Button className="btn-lg shadow-sm ml-3 mr-1" onClick={handleCreateBtnClick} id="create-btn" variant="dark">Create object</Button>
                        <Button className="btn-lg shadow-sm m-1" id="record-btn" variant="danger" disabled><CircleFill /></Button>
                        <Button className="btn-lg shadow-sm m-1" id="pause-btn" variant="dark" disabled><PauseFill /></Button>
                        <Button className="btn-lg shadow-sm m-1" id="resume-btn" variant="dark" disabled><PauseFill /><Slash /><PlayFill /></Button>
                        <Button className="btn-lg shadow-sm m-1 mr-3" id="stop-btn" variant="dark" disabled><SquareFill /></Button>
                    </div>
                </Row>
                <Row>
                    <Col sm={12} className="d-flex justify-content-center">
                        <p id="status-text" className="d-none border-primary mt-3 p-1 rounded bg-warning shadow"></p>
                    </Col>
                </Row>
                {playerShowState ? (
                    <>
                        <Row>
                            <Col>
                                <div className="bg-light mt-3 w-100">
                                    <canvas id="oscilloscope"></canvas>
                                </div>
                            </Col>
                            {/* <ReactMic
                    record={recordState}
                    className="sound-wave"
                    onStop={onStop}
                    onData={onData}
                    strokeColor="#000000"
                    backgroundColor="#FF4081" 
                    visualSetting="frequencyBars"
                    />
                <button onClick={startRecording} type="button">Start</button>
                <button onClick={stopRecording} type="button">Stop</button> */}
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-center p-4">
                                <audio style={{ width: '100%' }} id="audio-elem" style={{ filter: 'drop-shadow(5px 15px 0.8rem rgba(0, 0, 0, 0.2))' }} controls></audio>
                                {/* {document.getElementById('audio-elem').href ? 'true':'false'} */}
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-center mt-2">
                            <div className="bg-secondary rounded shadow-sm text-light p-3">
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Name your recording:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={fileNameState}
                                            onChange={e => setFileNameState(e.target.value)}
                                            readOnly={buttonState}
                                        />
                                    </Form.Group>
                                    <Button onClick={saveRecording} disabled={buttonState}>Save</Button>
                                    <a id="download-link" download={fileNameState.split(' ').join('_') + '.wav'}></a>
                                </Form>
                            </div>
                        </Row>
                    </>
                ) : null}
            </div>

        </div>
    )
}
