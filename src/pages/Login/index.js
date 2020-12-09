import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import SignUpForm from '../../components/SignUpForm';
import LoginForm from '../../components/LoginForm';
import soundbar from "../../assets/images/soundbar.png";

export default function Login() {

    const [formState, setFormState] = useState(true);

    return (
        <div className="Login">
            <Row className="my-5">
                <Col sm={12} style={{ background: `url(${soundbar}) center bottom repeat`, height: 178, filter: 'drop-shadow(10px 15px 2rem rgba(0, 0, 0, 0.4))' }} className="p-3 d-flex align-items-end">
                    <div className="d-flex tex-center p-2 rounded text-light" style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
                        <h1 className="font-weight-bold">{formState?'Login!':'Sign Up!'}</h1>
                    </div>
                </Col>
            </Row>
            <Row>
                {/* <Col xs={12} className="d-flex justify-content-center">
                    {formState?<h1>Login!</h1>:<h1>Sign Up!</h1>}
                </Col> */}
                <Col xs={12} className="d-flex justify-content-center">
                    <Button onClick={()=>setFormState(!formState)} className="btn-lg">
                        {!formState?"GO TO LOGIN FORM":"CLICK HERE TO SIGN UP"}
                    </Button>
                </Col>
            </Row>
            {formState ? <LoginForm /> : <SignUpForm />}
            
        </div>
    )
}
