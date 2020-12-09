import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Jumbotron, Col, Row, Container, Button, Navbar, Nav, DropdownButton, Dropdown, NavDropdown } from 'react-bootstrap'
import Chart from './components/Chart';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import API from './utils/API';
import { useHistory } from 'react-router-dom';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';


function App() {
  const history = useHistory();


  const [profileState, setProfileState] = useState({
    username: '',
    email: '',
    id: '',
    audioBlobs: []
  })
  const [rightEarDecibels, setRightEarDecibels] = useState([null, null, null, null, null, null, null]);
  const [leftEarDecibels, setLeftEarDecibels] = useState([null, null, null, null, null, null, null]);

  // useEffect(fetchUserData, [])

  // function fetchUserData() {
  //     const token = localStorage.getItem('token');
  //     // console.log("token: ", token)

  //     API.getProfile(token).then(profileData => {
  //         console.log("inside api function");
  //         // if(!profileData) history.push('/')


  //         if (profileData) {
  //             setProfileState({
  //                 username: profileData.data.username,
  //                 email: profileData.data.email,
  //                 id: profileData.data.id
  //             })

  //             setRightEarDecibels(JSON.parse(profileData.data.rightEar));
  //             setLeftEarDecibels(JSON.parse(profileData.data.leftEar));
  //         }
  //     })
  //     .catch(err => {
  //         // if(err.response) history.push('/')
  //         if(err.response) {
  //           console.log(err.response)
  //           // alert(err.response.data);
  //           // window.location.href="/"
  //         }
  //     })
  // }

  function logOutHandler() {
    setProfileState({
      username: '',
      email: '',
      id: '',
      audioBlobs: []
    })
    setLeftEarDecibels([null, null, null, null, null, null, null]);
    setRightEarDecibels([null, null, null, null, null, null, null]);
    localStorage.clear()
    window.location.href = "/";
  }



  return (
    <div className="App">
      <Router>
        <Navbar variant="dark" bg="dark" className="justify-content-between shadow-lg">
          <Navbar.Brand>
            Audio App
          </Navbar.Brand>
          <Nav>
            <Nav.Item>
              <NavDropdown variant="dark" title={profileState.username ? profileState.username : 'Welcome!'}>
                <NavDropdown.Item>About Us</NavDropdown.Item>
                {profileState.username ? (<NavDropdown.Item onClick={logOutHandler}>Log Out</NavDropdown.Item>) : null}
              </NavDropdown>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Container>

          {/* BEGIN ROUTING */}
          <Switch>
            <Route exact path={['/', '/home', '/login']}>
              <Login />
            </Route>
            <Route exact path="/chart">
              <Chart />
            </Route>
            <Route exact patt="/userpage">
              <UserPage
                profileState={profileState}
                setProfileState={setProfileState}
                leftEarDecibels={leftEarDecibels}
                rightEarDecibels={rightEarDecibels}
                setLeftEarDecibels={setLeftEarDecibels}
                setRightEarDecibels={setRightEarDecibels}
              />
            </Route>
            <Route exact path="*">
              <h1>404 not found</h1>
            </Route>
          </Switch>
        </Container>
        <footer id="footer" className="text-dark">
          <p className="p-3">
            &copy; &lt; ZGS &gt;  2020
          </p>
        </footer>
      </Router>
    </div>
  );
}

export default App;
