import React, { useState } from 'react';
import { Row, Col, Button, } from 'react-bootstrap';
// import recordAudio from './audiotool';
import { ReactMic } from 'react-mic';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import API from '../../utils/API';

export default function AudioTool({ rightEarDecibels, leftEarDecibels, profileState }) {
    // console.log(rightEarDecibels, leftEarDecibels)
    const [recordState, setRecordState] = useState(false);

    const [audioSource, setAudioSource] = useState({
        blobObject: null,
        recordingName: '',
    });

    const [audioBlob, setAudioBlob] = useState(null)

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
        API.saveRecording(audioSource, profileState.id)

    }

    function onPlay(){
        console.log('playing')
        console.log(audioBlob);
    }
    console.log(profileState);


    return (
        <div className="AudioTool">
            <Row className="mt-4">
                <Col className="d-flex justify-content-center">
                    <h1>Testing the audio tool!</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={() => setRecordState(true)}>Record</Button>
                    <Button variant="danger" onClick={() => setRecordState(false)}>Stop Recording</Button>
                    <Button variant="success">Play recording</Button>
                </Col>
                <Col>
                    <h1>recordState: {JSON.stringify(recordState)}</h1>
                </Col>
            </Row>
            <Row>
                <Col sm={12} className="d-flex justify-content-center">
                    <ReactMic
                        record={recordState}
                        className="sound-wave"
                        onStop={onStop}
                        onData={onData}
                        strokeColor="#000000"
                        backgroundColor="#FF4081"
                        visualSetting="frequencyBars"
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    {/* {!audioSource?null:audioSource} */}
                </Col>
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
            </Row>

        </div>
    )
}
