import React, { useState, useEffect } from 'react';
import Chart from '../../components/Chart';
import { Row, Col, Toast, Table, ButtonGroup, Button } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
import API from '../../utils/API';
import { useHistory } from 'react-router-dom';
import AudioTool from '../../components/AudioTool';
// import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import RecordingList from '../../components/RecordingList';
// import useWindowDimensions from '../../hooks/WindowDimensions';
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

const logoStyles = { 
    background: `url(${soundbar}) center bottom repeat`, 
    height: 178, 
    filter: 'drop-shadow(10px 15px 2rem rgba(0, 0, 0, 0.4))' 
}

export default function UserPage(props) {

    // const { height, width } = useWindowDimensions();

    const { profileState, setProfileState, leftEarDecibels, setLeftEarDecibels, rightEarDecibels, setRightEarDecibels } = props;

    const history = useHistory();

    // SHOW STATES FOR TOAST MESSAGES
    const [toastSaveShow, setToastSaveShow] = useState(false)
    const [toastClearShow, setToastClearShow] = useState(false)

    // RAW EAR DATA TO RESET CHART AFTER CLEAR/CHANGE
    const [rawEarData, setRawEarData] = useState()

    // SHOW STATES FOR MAIN APP TOOLS
    const [showAudioToolState, setShowAudioToolState] = useState(false);
    const [showChartState, setShowChartState] = useState(true)
    const [recordingListShow, setRecordingListShow] = useState(false)


    useEffect(() => {
        fetchUserData()
    }, [history])

    function fetchUserData() {
        console.log('fetching...')
        const token = localStorage.getItem('token');
        // console.log("token: ", token)

        API.getProfile(token).then(profileData => {
            console.log("results!");
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
                console.log(err)
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
        setRawEarData(updateObj);
        API.updateEarVals(userId, updateObj).then(res => {
            setToastSaveShow(true)
        })
        .then(fetchUserData)

    }

    function handleChartClear() {
        setLeftEarDecibels([null, null, null, null, null, null, null])
        setRightEarDecibels([null, null, null, null, null, null, null])
        setToastClearShow(true);
    }

    function deleteRecording(blobId) {
        API.deleteRecording(blobId)
        .then(fetchUserData)
    }

    function handleChartRestore() {
        console.log(JSON.parse(rawEarData.leftEar))
        setLeftEarDecibels(JSON.parse(rawEarData.leftEar))
        setRightEarDecibels(JSON.parse(rawEarData.rightEar))
    }


    return (
        <div className="UserPage">
            <Row className="my-5">
                <Col sm={12} style={logoStyles} className="p-3 d-flex align-items-end">
                    <div className="d-flex tex-center p-2 rounded text-light" style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
                        <h1 className="font-weight-bold">Hello {profileState.username}! <small>Welcome Back!</small></h1>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ButtonGroup>
                        <Button
                            className="btn-lg shadow"
                            variant={showChartState ? 'success' : 'secondary'}
                            onClick={() => setShowChartState(!showChartState)}>My Ear Chart
                        </Button>
                        <Button
                            className="btn-lg shadow"
                            variant={showAudioToolState ? 'success' : 'secondary'}
                            onClick={() => setShowAudioToolState(!showAudioToolState)}>My Audio Tool
                        </Button>
                        <Button
                            className="btn-lg shadow"
                            variant={recordingListShow ? 'success' : 'secondary'}
                            onClick={() => setRecordingListShow(!recordingListShow)}>My Recordings
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <div style={{minHeight: 800}}>
            {/* EAR CHART COMPONENT */}
            {showChartState ?
                <Chart
                    handleChartRestore={handleChartRestore}
                    handleChartClear={handleChartClear}
                    handleChartSave={handleChartSave}
                    rightEarDecibels={rightEarDecibels}
                    leftEarDecibels={leftEarDecibels}
                    setRightEarDecibels={setRightEarDecibels}
                    setLeftEarDecibels={setLeftEarDecibels}
                    setShowChartState={setShowChartState}
                /> : null}

            {/* AUDIO RECORDING COMPONENT */}
            {showAudioToolState ?
                <AudioTool
                    rightEarDecibels={rightEarDecibels}
                    leftEarDecibels={leftEarDecibels}
                    profileState={profileState}
                    fetchUserData={fetchUserData}
                    setShowAudioToolState={setShowAudioToolState}
                /> : null}

            {/* LIST OF USER RECORDINGS */}
            {recordingListShow ? (
                <>
                    <Row className="d-flex">
                        <Col className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="close"
                                aria-label="Close"
                                onClick={() => setRecordingListShow(!recordingListShow)}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </Col>
                    </Row>
                    <Row className=" mt-3 d-flex justify-content-center text-center">
                        <span className="w-100 rounded p-1 font-weight-bold text-light bg-secondary shadow-sm mb-2" style={{ fontSize: '2.2rem' }}>
                            My Recordings
                    </span>
                    </Row>
                    {profileState.audioBlobs.length > 0 ? (
                        <>
                            <Row className="d-flex justify-content-center pb-5">
                                <Col md={12} lg={10}>
                                    <Table
                                        striped
                                        bordered
                                        hover
                                        variant="dark"
                                        className="shadow"
                                    >
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
                                                    <RecordingList key={recording.id} recording={recording} i={i} deleteRecording={deleteRecording} rightEarDecibels={rightEarDecibels} leftEarDecibels={leftEarDecibels} fetchUserData={fetchUserData}/>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </>
                    ) : <h1>No recordings yet! Open the Audio Tool to begin recording</h1>
                    }{/* END RECORDING LIST TABLE */}
                </>) : null} {/* END RECORDING LIST SECTION */}
            </div>
            {/* TOASTS TO APPEAR VIA USER ACTION */}
            <Toast
                onClose={() => setToastSaveShow(false)}
                show={toastSaveShow}
                delay={2000}
                autohide
                style={toastSaveStyles}
            >
                <Toast.Header>
                    <strong className="mr-auto">
                        Success! Your settings have been saved for your next visit!
                    </strong>
                </Toast.Header>
                {/* <Toast.Body>
                    Success! Your settings have been saved for your next visit!
                </Toast.Body> */}
            </Toast>
            <Toast
                onClose={() => setToastClearShow(false)}
                show={toastClearShow}
                delay={2000}
                autohide
                style={toastClearStyles}
            >
                <Toast.Header>
                    <strong className="mr-auto">
                        You have cleared all the chart values, but your saved values are still there! Click the 'Restore chart' button to retrieve your data!
                    </strong>
                </Toast.Header>
                {/* <Toast.Body>
                    Success! Your settings have been saved for your next visit!
                </Toast.Body> */}
            </Toast>
        </div>
    )
}
