import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import SignUpForm from '../../components/SignUpForm';
import LoginForm from '../../components/LoginForm';

export default function Login() {

    const [formState, setFormState] = useState(false);

    return (
        <div className="Login">
            <Row>
                <Col xs={12} className="d-flex justify-content-center">
                    <Button onClick={()=>setFormState(!formState)}>
                        {formState?"login":"sign up"}
                    </Button>
                </Col>
            </Row>
            {formState ? <LoginForm /> : <SignUpForm />}
            
        </div>
    )
}
