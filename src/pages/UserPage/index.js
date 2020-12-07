import React, { useState, useEffect } from 'react';
import Chart from '../../components/Chart';
import { Row, Col, Toast, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import API from '../../utils/API';
import { useHistory } from 'react-router-dom';
import AudioTool from '../../components/AudioTool';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import RecordingList from '../../components/RecordingList';
import useWindowDimensions from '../../hooks/WindowDimensions';
import soundbar from '../../assets/images/soundbar.png';

const toastSaveStyles = {
    position: 'fixed',
    bottom: '40vh',
    left: '25vw',
    width: '50vw',
    background: 'green'
}

const toastClearStyles = {
    position: 'fixed',
    bottom: '40vh',
    left: '25vw',
    width: '50vw',
    background: 'red'
}

export default function UserPage(props) {

    const { height, width } = useWindowDimensions();

    const { profileState, setProfileState, leftEarDecibels, setLeftEarDecibels, rightEarDecibels, setRightEarDecibels } = props;

    const history = useHistory();

    const [toastSaveShow, setToastSaveShow] = useState(false)
    const [toastClearShow, setToastClearShow] = useState(false)
    const [rawEarData, setRawEarData] = useState([])


    useEffect(fetchUserData, [history])

    function fetchUserData() {
        const token = localStorage.getItem('token');
        // console.log("token: ", token)

        API.getProfile(token).then(profileData => {
            console.log("inside api function");
            if (!profileData) {
                alert('your session has expired, please login')
                history.push('/')
            }


            if (profileData) {
                console.log(profileData)
                setProfileState({
                    username: profileData.data.username,
                    email: profileData.data.email,
                    id: profileData.data.id,
                    audioBlobs: profileData.data.AudioBlobs
                })

                setRightEarDecibels(JSON.parse(profileData.data.rightEar));
                setLeftEarDecibels(JSON.parse(profileData.data.leftEar));
                setRawEarData({
                    rightEar: profileData.data.rightEar,
                    leftEar: profileData.data.leftEar
                })
            }
        })
            .catch(err => {
                if (err.response) {
                    console.log(err.response)
                    alert(err.response.data)
                    history.push('/')
                }
            })
    }

    function handleChartSave() {
        const userId = profileState.id;
        const updateObj = {
            rightEar: JSON.stringify(rightEarDecibels),
            leftEar: JSON.stringify(leftEarDecibels)
        }
        API.updateEarVals(userId, updateObj).then(res => {
            setToastSaveShow(true)
        })

    }

    function handleChartClear() {
        setLeftEarDecibels([null, null, null, null, null, null, null])
        setRightEarDecibels([null, null, null, null, null, null, null])
        setToastClearShow(true);
    }

    function deleteRecording(blobId) {
        API.deleteRecording(blobId)
        fetchUserData()
    }

    function handleChartRestore() {
        setLeftEarDecibels(JSON.parse(rawEarData.leftEar))
        setRightEarDecibels(JSON.parse(rawEarData.rightEar))
    }


    return (
        <div className="UserPage">
            <Row className="my-5">
                <Col sm={12} style={{background: `url(${soundbar}) center bottom repeat`, height: 178, filter:'drop-shadow(10px 15px 2rem rgba(0, 0, 0, 0.4))' }} className="p-3 d-flex align-items-end">
                    <div className="d-flex tex-center p-2 rounded text-light" style={{background: 'rgba(0, 0, 0, 0.4)'}}>
                        <h1 className="font-weight-bold">Hello {profileState.username}! <small>Welcome Back!</small></h1>
                    </div>
                </Col>
            </Row>
            {/* EAR CHART COMPONENT */}
            <Chart
                handleChartRestore={handleChartRestore}
                handleChartClear={handleChartClear}
                handleChartSave={handleChartSave}
                rightEarDecibels={rightEarDecibels}
                leftEarDecibels={leftEarDecibels}
                setRightEarDecibels={setRightEarDecibels}
                setLeftEarDecibels={setLeftEarDecibels}
            />

            <hr />

            {/* AUDIO RECORDING COMPONENT */}
            <AudioTool
                rightEarDecibels={rightEarDecibels}
                leftEarDecibels={leftEarDecibels}
                profileState={profileState}
                fetchUserData={fetchUserData}
            />

            {/* LIST OF USER RECORDINGS */}
            {profileState.audioBlobs.length > 0 ? (
                <>
                    <Row className=" mt-3 d-flex justify-content-center text-center">
                        <span className="w-100 rounded p-1 font-weight-bold text-light bg-secondary shadow-sm mb-2" style={{ fontSize: '2.2rem' }}>
                            My Recordings
                        </span>
                    </Row>
                    <Row className="d-flex justify-content-center pb-5">
                        <Col md={12} lg={10}>
                            <Table striped bordered hover variant="dark" className="shadow">
                                <thead>
                                    <tr>
                                        <th>Recording</th>
                                        <th>Player</th>
                                        <th>Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profileState.audioBlobs.map((recording, i) => {
                                        return (
                                            <RecordingList key={recording.id} recording={recording} i={i} deleteRecording={deleteRecording} />
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </>
            ) : null}
            {/* TOASTS TO APPEAR VIA USER ACTION */}
            <Toast onClose={() => setToastSaveShow(false)} show={toastSaveShow} delay={2000} autohide style={toastSaveStyles}>
                <Toast.Header>
                    <strong className="mr-auto">
                        Success! Your settings have been saved for your next visit!
                    </strong>
                </Toast.Header>
                {/* <Toast.Body>
                    Success! Your settings have been saved for your next visit!
                </Toast.Body> */}
            </Toast>
            <Toast onClose={() => setToastClearShow(false)} show={toastClearShow} delay={2000} autohide style={toastClearStyles}>
                <Toast.Header>
                    <strong className="mr-auto">
                        You have cleared all the chart values, but your saved values are still there! Just refresh the page to see them again
                    </strong>
                </Toast.Header>
                {/* <Toast.Body>
                    Success! Your settings have been saved for your next visit!
                </Toast.Body> */}
            </Toast>
        </div>
    )
}
