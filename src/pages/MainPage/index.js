import React, { useState } from 'react';
import Chart from '../../components/Chart';
import { Row, Col } from 'react-bootstrap'



export default function MainPage() {

    const [rightEarDecibels, setRightEarDecibels] = useState([null, null, null, null, null, null, null]);
    const [leftEarDecibels, setLeftEarDecibels] = useState([null, null, null, null, null, null, null]);
    const [chartShowState, setChartShowState] = useState(true)

    return (
        <div className="MainPage">
            <Chart rightEarDecibels={rightEarDecibels} leftEarDecibels={leftEarDecibels} setRightEarDecibels={setRightEarDecibels} setLeftEarDecibels={setLeftEarDecibels} />
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
