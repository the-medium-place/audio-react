import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Jumbotron, Col, Row, Container } from 'react-bootstrap'
import Chart from './components/Chart';
import MainPage from './pages/UserPage';
import Login from './pages/Login';
import UserPage from './pages/UserPage';


function App() {
  return (
    <div>
      <Router>
        <Jumbotron>
          <h1> Setting up Audio React </h1>
          <p className="lead">Testing some after text.</p>
        </Jumbotron>
        <Container>
          <Switch>
            <Route exact path={['/', '/home']}>
              <MainPage />
            </Route>
            <Route exact path="/chart">
              <Chart />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact patt="/userpage">
              <UserPage />
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
