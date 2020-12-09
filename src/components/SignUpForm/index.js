import React, { useState } from 'react';
// import { useHistory } from "react-router-dom";
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import API from '../../utils/API';
import LoginForm from '../LoginForm';

export default function SignUpForm(props) {
    // const history = useHistory()

    const [userState, setUserState] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [passConfState, setPassConfState] = useState('')

    const [modalShow, setModalShow] = useState(false);

    const toggleModal = () => setModalShow(!modalShow);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserState({ ...userState, [name]: value })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        API.createUser(userState)
            .then(res => {
                console.log(res)
                setUserState({
                    username: '',
                    email: '',
                    password: ''
                })
                setPassConfState('')
                setModalShow(true)
                // props.setFormState(!props.formState)

            })
            .catch(err => console.log(err))
    }

    return (
        <div className="SignUpform">
            <Row className="d-flex justify-content-center">
                <Col xs={10}>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Pick a username:</Form.Label>
                            <Form.Control value={userState.username} onChange={handleInputChange} name="username" type="text" placeholder="username" />
                            {userState.username.length < 5 ? (
                                <Form.Text className="text-danger">
                                    Username must be at least 5 characters
                                </Form.Text>
                            ) : null}
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={userState.email} onChange={handleInputChange} name="email" type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={userState.password} onChange={handleInputChange} name="password" type="password" placeholder="Password" />
                            {userState.password.length < 8 ? 
                            <Form.Text className="text-danger">
                                Password must be minimum 8 characters    
                            </Form.Text> : null }

                        </Form.Group>
                        <Form.Group controlId="formBasicPassword2">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control value={passConfState} onChange={(e) => setPassConfState(e.target.value)} name="password-conf" type="password" placeholder="Password" />
                            {(userState.password.length >= 8 && userState.password === passConfState) ? null : (
                                <Form.Text className="text-danger" style={{ color: 'red' }}>
                                    Your passwords don't match!
                                </Form.Text>)}
                        </Form.Group>
                        {/* <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group> */}
                        <Button variant="secondary" type="submit" className="btn-lg">
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Modal show={modalShow} onHide={toggleModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Login!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <LoginForm />
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button> */}
                        {/* <Button variant="primary" onClick={toggleModal}>
                            Save Changes
                    </Button>*/}
                    </Modal.Footer> 
                </Modal>
            </Row>
        </div>
    )
}
