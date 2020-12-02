import React, { useState, useEffect } from 'react';
import { Row, Col, Button, } from 'react-bootstrap';
// import recordAudio from './audiotool';

// import { ReactMic } from 'react-mic';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
// import API from '../../utils/API';


export default function AudioTool({ rightEarDecibels, leftEarDecibels, profileState, fetchUserData }) {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "/assets/js/audiotool.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);


    const [showState, setShowState] = useState(false)
    // let audioChunks;
    // let mediaRecorder

    // function saveRecording() {
    //     console.log('save btn clicked');
    //     const formData = new FormData();
    //     formData.append('audio-file', audioSource.blobObject.blob)
    //     console.log(audioSource.blobObject.blob)
    //     console.log("formData: ", formData)
    //     const audioSaveObj = {
    //         blobObject: formData,
    //         recordingName: audioSource.recordingName
    //     }
    //     API.saveRecording(audioSaveObj, profileState.id)

    //     fetchUserData();
    // }



    return (
        <div className="AudioTool" style={{ border: '1px solid black', margin: '1rem 0' }}>
            <Row>
                <Col sm={3}>
                    <Button onClick={() => setShowState(!showState)}>{showState ? 'Hide Audio Tool' : 'Show AudioTool'}</Button>
                </Col>
                <Col sm={9}>
                    {!showState ? <>
                        <h2>&lt;----- Click to open your audio recorder!</h2>
                        <br />
                        <p id="defaultMime"></p>
                    </>
                        : null}
                </Col>
            </Row>
            {showState ?
                <>
                    <Row className="mt-4">
                        <Col className="d-flex justify-content-center">
                            <h1>Testing the audio tool!</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button className="m-1" id="create-btn" variant="dark">create object</Button>
                            <Button className="m-1" id="record-btn" variant="danger">record</Button>
                            <Button className="m-1" id="pause-btn" variant="warning">pause record</Button>
                            <Button className="m-1" id="resume-btn" variant="warning">resume record</Button>
                            <Button className="m-1" id="stop-btn">stop record</Button>
                            <Button className="m-1" id="play-btn" variant="success">play recording</Button>
                            {/* <Button variant="primary" onClick={() => setRecordState(true)}>Record</Button> */}
                            {/* <Button variant="primary" disabled={!recordState} onClick={() => setPauseState(!pauseState)}>{pauseState?"Un-Pause Rec":"Pause Rec"}</Button> */}
                            {/* <Button variant="danger" onClick={() => setRecordState(false)}>Stop Recording</Button> */}
                            {/* <Button variant="success">Play recording</Button> */}
                        </Col>
                        {/* <Col>
                            <h1>recordState: {JSON.stringify(recordState)}</h1>
                        </Col> */}
                    </Row>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-center">
                            <p id="status-text">mic tool</p>
                            {/* <ReactMic
                        record={recordState}
                        pause={pauseState}
                        className="sound-wave"
                        onStop={onStop}
                        onData={onData}
                        strokeColor="#000000"
                        backgroundColor="#666666"
                        visualSetting="frequencyBars"
                        mimeType="audio/wav"

                    /> */}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-center">
                            <audio id="audio-elem" controls ></audio>
                            {/* <Button onClick={saveRecording}>
                        Save Recording
                    </Button> */}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-center mt-2">
                <a id="download-link" href=""></a>
                        </Col>
                    </Row>
                </>
                : null}

        </div>
    )
}
