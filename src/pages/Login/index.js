import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import SignUpForm from '../../components/SignUpForm';
import LoginForm from '../../components/LoginForm';

export default function Login() {

    const [formState, setFormState] = useState(false);

    return (
        <div className="Login">
            {formState ? <LoginForm /> : <SignUpForm />}
            
        </div>
    )
}
