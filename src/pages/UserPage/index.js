import React, { useState, useEffect } from 'react';
import Chart from '../../components/Chart';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import API from '../../utils/API';



export default function UserPage() {

    const params = useParams();


    const [profileState, setProfileState] = useState({
        username: '',
        email: '',
        id: '',
    })
    const [rightEarDecibels, setRightEarDecibels] = useState([null, null, null, null, null, null, null]);
    const [leftEarDecibels, setLeftEarDecibels] = useState([null, null, null, null, null, null, null]);
    const [chartShowState, setChartShowState] = useState(true)

    

    useEffect(fetchUserData, [])

    function fetchUserData() {
        const token = localStorage.getItem('token');
        // console.log("token: ", token)

        API.getProfile(token).then(profileData => {
            console.log("inside api function");
            
            if (profileData) {
                console.log("profileData: ", profileData)
                setProfileState({
                    username: profileData.data.username,
                    email: profileData.data.email,
                    id: profileData.data.id
                })
                
                setRightEarDecibels(JSON.parse(profileData.data.rightEar));
                setLeftEarDecibels(JSON.parse(profileData.data.leftEar));
            }
        })
    }

    function handleChartSave(){
        const userId = profileState.id;
        const updateObj = {
            rightEar: JSON.stringify(rightEarDecibels),
            leftEar: JSON.stringify(leftEarDecibels)
        }
        API.updateEarVals(userId, updateObj)

    }




    return (
        <div className="UserPage">
            <Chart handleChartSave={handleChartSave} rightEarDecibels={rightEarDecibels} leftEarDecibels={leftEarDecibels} setRightEarDecibels={setRightEarDecibels} setLeftEarDecibels={setLeftEarDecibels} />
            <Row>
                <Col sm={4}></Col>
                <Col sm={4}>
                    {/* <span>Click to set: </span>
                    <Button
                        onClick={() => setEarState(!earState)}
                    >
                        {earState ? 'Right Ear' : 'Left Ear'}
                    </Button> */}
                </Col>
                <Col sm={4}></Col>
            </Row>
        </div>
    )
}
