import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Form, Row, Col, Button } from 'react-bootstrap';
import API from '../../utils/API';

export default function SignUpForm() {
    const history = useHistory()

    const [userState, setUserState] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [passConfState, setPassConfState] = useState('')  

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserState({ ...userState, [name]: value })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(userState);
        API.createUser(userState)
        .then(res => {
            console.log(res)
            history.push('/home')

        })
        .catch(err => console.log(err))

    }

    const checkFormVals = () => {
        // return (formValState.usernameLength && formValState.emailValid && formValState.passwordLength && formValState.passwordConfirmMatch === userState.password)
    }

    return (
        <div className="SignUpform">
            <Row className="d-flex justify-content-center">
                <Col></Col>
                <Col xs={10}>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Pick a username:</Form.Label>
                            <Form.Control value={userState.username} onChange={handleInputChange} name="username" type="text" placeholder="username" />
                            {userState.username.length < 5 ? (
                                <Form.Text className="text-muted">
                                    Username must be at least 5 characters
                                </Form.Text>
                            ) : null}
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={userState.email} onChange={handleInputChange} name="email" type="email" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={userState.password} onChange={handleInputChange} name="password" type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword2">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control value={passConfState} onChange={(e) => setPassConfState(e.target.value)} name="password-conf" type="password" placeholder="Password" />
                            {(userState.password.length >= 8 && userState.password === passConfState) ? null : (
                                <Form.Text className="text-muted" style={{ color: 'red' }}>
                                    Your passwords don't match!
                                </Form.Text>)}
                        </Form.Group>
                        {/* <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group> */}
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
        </div>
    )
}
