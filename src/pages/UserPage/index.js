import React, { useState, useEffect } from 'react';
import Chart from '../../components/Chart';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import API from '../../utils/API';
import { useHistory } from 'react-router-dom';



export default function UserPage() {

    const history = useHistory();

    const params = useParams();


    const [profileState, setProfileState] = useState({
        username: '',
        email: '',
        id: '',
    })
    const [rightEarDecibels, setRightEarDecibels] = useState([null, null, null, null, null, null, null]);
    const [leftEarDecibels, setLeftEarDecibels] = useState([null, null, null, null, null, null, null]);
    const [chartShowState, setChartShowState] = useState(true)

    

    useEffect(fetchUserData, [history])

    function fetchUserData() {
        const token = localStorage.getItem('token');
        // console.log("token: ", token)

        API.getProfile(token).then(profileData => {
            console.log("inside api function");
            if(!profileData) history.push('/')
        
            
            if (profileData) {
                setProfileState({
                    username: profileData.data.username,
                    email: profileData.data.email,
                    id: profileData.data.id
                })
                
                setRightEarDecibels(JSON.parse(profileData.data.rightEar));
                setLeftEarDecibels(JSON.parse(profileData.data.leftEar));
            }
        })
        .catch(err => {
            if(err.response) history.push('/')
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

    function handleChartClear(){
        setLeftEarDecibels([null, null, null, null, null, null, null])
        setRightEarDecibels([null, null, null, null, null, null, null])

    }




    return (
        <div className="UserPage">
            <Row>
                <Col sm={12}>
                    <h1>Hello {profileState.username}! <small>Welcome Back!</small></h1>
                </Col>
            </Row>
            <Chart handleChartClear={handleChartClear} handleChartSave={handleChartSave} rightEarDecibels={rightEarDecibels} leftEarDecibels={leftEarDecibels} setRightEarDecibels={setRightEarDecibels} setLeftEarDecibels={setLeftEarDecibels} />
            <Row>
                <Col sm={4}></Col>
                <Col sm={4}>
                </Col>
                <Col sm={4}></Col>
            </Row>
        </div>
    )
}
