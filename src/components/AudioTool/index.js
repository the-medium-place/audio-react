import React, { useState } from 'react';
import { Row, Col, Button, } from 'react-bootstrap';
// import recordAudio from './audiotool';
import { ReactMic } from 'react-mic';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import API from '../../utils/API';



export default function AudioTool({ rightEarDecibels, leftEarDecibels, profileState, fetchUserData }) {
    // console.log(rightEarDecibels, leftEarDecibels)
    const [recordState, setRecordState] = useState(false);
    const [pauseState, setPauseState] = useState(false)

    const [audioSource, setAudioSource] = useState({
        blobObject: null,
        recordingName: '',
    });

    const [audioBlob, setAudioBlob] = useState(null)

    const [showState, setShowState] = useState(false)

    function onData(recordedBlob) {
        console.log('chunk of real-time data is: ', recordedBlob);
    }

    function onStop(recordedBlob) {
        console.log('recordedBlob is: ', recordedBlob);
        setAudioSource({
            blobObject: recordedBlob,
            recordingName: 'my recording'
        })
        setAudioBlob(recordedBlob)
        // const url = URL.createObjectURL(recordedBlob.blob)
    }

    function saveRecording() {
        console.log('save btn clicked');
        const formData = new FormData();
        formData.append('audio-file', audioSource.blobObject.blob)
        console.log(audioSource.blobObject.blob)
        console.log("formData: ", formData)
        const audioSaveObj = {
            blobObject: formData,
            recordingName: audioSource.recordingName
        }
        API.saveRecording(audioSaveObj, profileState.id)

        fetchUserData();
    }

    function onPlay(){
        console.log('playing')
        // console.log(audioBlob);
    }
    console.log(profileState);


    return (
        <div className="AudioTool" style={{border: '1px solid black', margin: '1rem 0'}}>
            <Row>
                <Col sm={3}>
                    <Button onClick={() => setShowState(!showState)}>{showState ? 'Hide Audio Tool' : 'Show AudioTool'}</Button>
                </Col>
                <Col sm={9}>
                    {!showState ? <h2>&lt;----- Click to open your audio recorder!</h2> : null}
                </Col>
            </Row>
            {showState ? <>
            <Row className="mt-4">
                <Col className="d-flex justify-content-center">
                    <h1>Testing the audio tool!</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={() => setRecordState(true)}>Record</Button>
                    {/* <Button variant="primary" disabled={!recordState} onClick={() => setPauseState(!pauseState)}>{pauseState?"Un-Pause Rec":"Pause Rec"}</Button> */}
                    <Button variant="danger" onClick={() => setRecordState(false)}>Stop Recording</Button>
                    {/* <Button variant="success">Play recording</Button> */}
                </Col>
                <Col>
                    <h1>recordState: {JSON.stringify(recordState)}</h1>
                </Col>
            </Row>
            <Row>
                <Col sm={12} className="d-flex justify-content-center">
                    <ReactMic
                        record={recordState}
                        pause={pauseState}
                        className="sound-wave"
                        onStop={onStop}
                        onData={onData}
                        strokeColor="#000000"
                        backgroundColor="#666666"
                        visualSetting="frequencyBars"
                        mimeType="audio/wav"

                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button onClick={saveRecording}>
                        Save Recording
                    </Button>
                </Col>
            </Row>
            <Row>
                {audioBlob ? (
                    <AudioPlayer
                        src={audioSource.blobObject.blobURL}
                        onPlay={onPlay}
                    />
                ) : null
                }
            </Row></>
            : null}

        </div>
    )
}
