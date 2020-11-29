import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Jumbotron, Col, Row, Container, Button } from 'react-bootstrap'
import Chart from './components/Chart';
import MainPage from './pages/UserPage';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import API from './utils/API';
import { useHistory } from 'react-router-dom';


function App() {
  const history = useHistory();


  const [profileState, setProfileState] = useState({
    username: '',
    email: '',
    id: '',
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

function logOutHandler(){
  setProfileState({
    username: '',
    email: '',
    id: '',
  })
  setLeftEarDecibels([null, null, null, null, null, null, null]);
  setRightEarDecibels([null, null, null, null, null, null, null]);
  localStorage.clear()
  window.location.href="/";
}



  return (
    <div>
      <Router>
        <Jumbotron>
          <h1> Setting up Audio React </h1>
          <p className="lead">{profileState.username?profileState.username:'Hello there!'}</p>
          {profileState.username?<Button onClick={logOutHandler}>Log Out</Button>:null}
        </Jumbotron>
        <Container>
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
      </Router>

      {/* <Jumbotron>
        <h1> Setting up Audio React </h1>
        <p className="lead">Testing some after text.</p>
      </Jumbotron>
      <Container>
        <Row>
          <h1>will be button to open ear chart modal</h1>
        </Row>
      </Container> */}
    </div>
  );
}

export default App;
