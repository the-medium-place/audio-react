import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, } from 'react-bootstrap';
import API from '../../utils/API'

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
// import API from '../../utils/API';

import { PlayFill, PauseFill, CircleFill, SquareFill, Slash } from 'react-bootstrap-icons';


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
    const [buttonState, setButtonState] = useState(true);
    const [fileNameState, setFileNameState] = useState('my_recording')
    const [playerShowState, setPlayerShowState] = useState(false)

    async function saveRecording() {
        console.log('save btn clicked');
        console.log('audiofile: ', window.audioFile)

        //UPLOAD AUDIO FILE TO CLOUDINARY
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
        // SAVE RESULTING URL TO DATABASE FOR USER

        const audioSaveObj = {
            audioURL: fileInfo.secure_url,
            recordingName: fileNameState,
            cloudinaryId: fileInfo.public_id
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
    }

    return (
        <div className="AudioTool">
            <Row>
                <Col className="d-flex justify-content-center">
                    <Button onClick={() => setShowState(!showState)}>{showState ? 'Hide Audio Tool' : 'Show AudioTool'}</Button>
                </Col>
            </Row>
            {showState ?
                <>
                    <Row className="mt-4">
                        <Col sm={12} className="d-flex justify-content-center flex-column text-center">
                            <h4 className="p-2 m-3" style={{ background: 'rgba(200, 0, 0, 0.4)' }}>Note: In order for the recorder to work, you must be viewing the site from secure connection.<br /> ** MAKE SURE THE WEBSITE URL SAYS 'https://' (with an 's' at the end)**</h4>
                            <h5 className="p-2 m-3" style={{ background: 'rgba(200, 0, 0, 0.4)' }}>If you are on an iPhone, you MUST USE the native iOS Safari browser</h5>
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-center">
                        <div className="rounded shadow" style={{ background: 'lightgray', paddingTop: 10, paddingBottom: 10 }}>
                            <Button className="shadow-sm ml-3 mr-1" onClick={handleCreateBtnClick} id="create-btn" variant="dark">Create object</Button>
                            <Button className="shadow-sm m-1" id="record-btn" variant="danger" disabled><CircleFill /></Button>
                            <Button className="shadow-sm m-1" id="pause-btn" variant="dark" disabled><PauseFill /></Button>
                            <Button className="shadow-sm m-1" id="resume-btn" variant="dark" disabled><PauseFill /><Slash /><PlayFill /></Button>
                            <Button className="shadow-sm m-1 mr-3" id="stop-btn" variant="dark" disabled><SquareFill /></Button>
                        </div>
                    </Row>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-center">
                            <p id="status-text" className="border-primary mt-3 p-1 rounded bg-warning shadow"></p>
                        </Col>
                    </Row>
                    {playerShowState ? (
                        <>
                            <Row>
                                <Col className="d-flex justify-content-center p-4">
                                    <audio style={{ width: '100%' }} id="audio-elem" style={{filter:'drop-shadow(5px 15px 1.2rem rgba(0, 0, 0, 0.2))'}} controls></audio>
                                    {/* {document.getElementById('audio-elem').href ? 'true':'false'} */}
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center mt-2">
                                <div className="border border-dark p-3">
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
                                            <a id="download-link" download={fileNameState + '.wav'}></a>
                                    </Form>
                                </div>
                            </Row>
                        </>
                    ) : null}
                </>
                : null}
        </div>
    )
}
