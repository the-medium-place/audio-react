import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import API from '../../utils/API';
import { useHistory } from "react-router-dom";

export default function LoginForm() {
    const history = useHistory();

    const [loginState, setLoginState] = useState({
        username: '',
        password: ''
    })


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginState({...loginState, [name]:value})
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // console.log(loginState);
        API.userLogin(loginState)
        .then(resToken => {
            // console.log(resToken.data.token)
            localStorage.setItem('token', resToken.data.token)
            history.push('/userpage/')
        })
        .catch(err => console.log(err))

    }

    return (
        <div className="LoginForm">
            <Row className="d-flex justify-content-center">
                <Col xs={10}>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control value={loginState.username} onChange={handleInputChange} name="username" type="text" placeholder="Enter username" />
                            {/* <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text> */}
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={loginState.password} onChange={handleInputChange} name="password" type="password" placeholder="Enter password" />
                            {/* <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text> */}
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
