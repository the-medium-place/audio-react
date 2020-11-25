import React, { useState, useEffect } from 'react';
import Chart from '../../components/Chart';
import { Button, Row, Col } from 'react-bootstrap'



export default function MainPage() {

    const [earState, setEarState] = useState(false);
    const [rightEarDecibels, setRightEarDecibels] = useState([null, null, null, null, null, null, null]);
    const [leftEarDecibels, setLeftEarDecibels] = useState([null, null, null, null, null, null, null]);


    return (
        <div className="MainPage">
            <Chart earState={earState} rightEarDecibels={rightEarDecibels} leftEarDecibels={leftEarDecibels} setRightEarDecibels={setRightEarDecibels} setLeftEarDecibels={setLeftEarDecibels} />
            <Button
            onClick={() => setEarState(!earState)}
            >
                {earState ? 'Right Ear' : 'Left Ear'}
            </Button>
        </div>
    )
}
