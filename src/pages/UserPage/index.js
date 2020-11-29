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

    const { profileState, setProfileState, leftEarDecibels, setLeftEarDecibels, rightEarDecibels, setRightEarDecibels } = props;

    const history = useHistory();

    // const params = useParams();


    // const [profileState, setProfileState] = useState({
    //     username: '',
    //     email: '',
    //     id: '',
    // })
    // const [rightEarDecibels, setRightEarDecibels] = useState([null, null, null, null, null, null, null]);
    // const [leftEarDecibels, setLeftEarDecibels] = useState([null, null, null, null, null, null, null]);

    const [toastSaveShow, setToastSaveShow] = useState(false)
    const [toastClearShow, setToastClearShow] = useState(false)


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




    return (
        <div className="UserPage">
            <Row>
                <Col sm={12}>
                    <h1>Hello {profileState.username}! <small>Welcome Back!</small></h1>
                </Col>
            </Row>
            {/* EAR CHART COMPONENT */}
            <Chart handleChartClear={handleChartClear} handleChartSave={handleChartSave} rightEarDecibels={rightEarDecibels} leftEarDecibels={leftEarDecibels} setRightEarDecibels={setRightEarDecibels} setLeftEarDecibels={setLeftEarDecibels} />

            {/* AUDIO RECORDING COMPONENT */}
            <AudioTool rightEarDecibels={rightEarDecibels} leftEarDecibels={leftEarDecibels} profileState={profileState} />

            {/* LIST OF USER RECORDINGS */}
            <Row>
                <Col xs={10}>

                    <Table striped bordered hover variang="dark"  style={{maxWidth: '85vw'}}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Recording Name</th>
                                <th>Blob String</th>
                                <th>Player</th>
                            </tr>
                        </thead>
                        <tbody>

                            {profileState.audioBlobs.map((blob, i) => {
                                return (
                                    <RecordingList key={blob.id} blob={blob} i={i}/>
                                    // <tr key={blob.id}>
                                    //     <td>{i + 1}</td>
                                    //     <td>{blob.recordingName}</td>
                                    //     <td>{blob.blobString}</td>
                                    //     {/* {console.log(JSON.parse(blob.blobString))} */}
                                    //     <td>
                                    //         <AudioPlayer
                                    //             src={JSON.parse(blob.blobString)["blobURL"]}
                                    //             onPlay={()=>console.log('play audio')}
                                    //         />
                                    //     </td>
                                    // </tr>
                                )
                            })}
                        </tbody>

                    </Table>
                </Col>
            </Row>
            
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
