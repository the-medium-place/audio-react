import React, { useState, useEffect } from 'react';
import { Row, Col, Button, } from 'react-bootstrap';
import API from '../../utils/API'

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

    // const testVar = window.testVariable


    const [showState, setShowState] = useState(false)

    const [audioFile, setAudioFile] = useState(null)

    // const uploadFile = async audioFile => {

    //     console.log(window.audioFile)

    //     const formData = new FormData()
    //     formData.append('file', window.audioFile);
    //     formData.append('upload_preset', 'xbbzgwk2');
    //     formData.append('resource_type', 'video');

    //     console.log('formData: ', formData)

    //     const options = {
    //         method: 'POST',
    //         body: formData,
    //     };

    //     const res = await fetch('https://api.Cloudinary.com/v1_1/zgscloud/video/upload', options)
    //     const fileInfo = await res.json()

    //     console.log(fileInfo)
    //     setAudioFile(fileInfo.secure_url)
    // }


    async function saveRecording() {
        console.log('save btn clicked');
        console.log('audiofile: ', window.audioFile)

        //UPLOAD AUDIO FILE TO CLOUDINARY
        // uploadFile();
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

        // SAVE RESULTING URL TO DATABASE FOR USER

        const audioSaveObj = {
            audioURL: fileInfo.secure_url,
            recordingName: "my recording"
        }
        console.log("audioSaveObj before save: ", audioSaveObj)
        API.saveRecording(audioSaveObj, profileState.id)

        // RELOAD USER PAGE WITH NEW INFO
        fetchUserData();
        window.location.reload();
    }



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
                        <Col sm={12} className="d-flex justify-content-center flex-column text-center">
                            <h1>Testing the audio tool!</h1>
                            {/* <br/> */}
                            <h4 className="p-2 m-3" style={{ background: 'rgba(200, 0, 0, 0.4)' }}>Note: In order for the recorder to work, you must be viewing the site from secure connection.<br /> ** MAKE SURE THE WEBSITE URL SAYS 'https://' (with an 's' at the end)**</h4>
                            {/* <br /> */}
                            <h5 className="p-2 m-3" style={{ background: 'rgba(200, 0, 0, 0.4)' }}>If you are on an iPhone, you MUST USE the native iOS Safari browser</h5>
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
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-center">
                            <p id="status-text">mic tool</p>
                        </Col>
                    </Row>
                    {showState ? (
                        <>
                            <Row>
                                <Col sm={12} className="d-flex justify-content-center">
                                    <audio id="audio-elem" controls onCanPlay={e => console.log('can play')}></audio>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} className="d-flex justify-content-center mt-2">
                                    <a id="download-link"></a>
                                    <button onClick={saveRecording}>save</button>
                                </Col>
                            </Row>
                        </>
                        ) : null}

                </>
                : null}
        </div>
    )
}
