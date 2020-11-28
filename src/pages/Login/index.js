import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import SignUpForm from '../../components/SignUpForm';
import LoginForm from '../../components/LoginForm';

export default function Login() {

    const [formState, setFormState] = useState(true);

    return (
        <div className="Login">
            <Row>
                <Col xs={12} className="d-flex justify-content-center">
                    {formState?<h1>Login!</h1>:<h1>Sign Up!</h1>}
                </Col>
                <Col xs={12} className="d-flex justify-content-center">
                    <Button onClick={()=>setFormState(!formState)}>
                        {!formState?"go to login form":"click here to sign up"}
                    </Button>
                </Col>
            </Row>
            {formState ? <LoginForm setformstate={setFormState}/> : <SignUpForm setformstate={setFormState} formstate={formState}/>}
            
        </div>
    )
}
