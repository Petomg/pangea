import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NavBar, NavBarItem, MainTitle } from './styled-components/NavBar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import PublicationCreate from "./components/PublicationCreate";
import PublicationList from "./components/PublicationsList";
import PublicationDetail from "./components/PublicationDetail";
import LoginForm from "./components/Login";
import LogoutForm from "./components/Logout";
import RegisterForm from "./components/Register";
import TopicForm from "./components/TopicAdd";
import Profile from "./components/Profile";

import * as general from "./operational/general_functionality";

import jwt from 'jsonwebtoken';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

function App() {
  let userToken = cookies.get('nToken');
  let uid = null;
  let uname = null;
  if (userToken !== undefined && userToken !== null) {
    let decodedToken = jwt.decode(userToken, { complete: true }) || {};  
    uid = decodedToken.payload.user._id;
    uname = decodedToken.payload.user.name;
  } 

  return (
    <div className="App">
       <Router>
      <div>
        <nav>
       
          <NavBar>
            <div>
              <MainTitle>PANGEA</MainTitle>
              <NavBarItem>
                <Link to="/" className="perso-link">Home</Link>
              </NavBarItem>
              <NavBarItem>
                <Link to="/create" className="perso-link">Create Publication</Link>
              </NavBarItem>
              <NavBarItem>
                <Link to="/topic-add" className="perso-link">Add Topic</Link>
              </NavBarItem>
            </div>
            
            <div>
              {!general.isLoggedIn() &&
                <NavBarItem>
                  <Link to="/login" className="perso-link">Log in</Link>
                </NavBarItem>
              }
              {general.isLoggedIn() &&
                <>
                  
                  <Link to={`/profile/${uid}`} className="perso-link-profile">{uname || "Profile"}</Link>
                 
                  <NavBarItem>
                    <Link to="/logout" className="perso-link">Logout</Link>
                  </NavBarItem>
                </>
              }
              <NavBarItem>
                <Link to="/register" className="perso-link">Sign up</Link>
              </NavBarItem>
            </div>
          </NavBar>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>

          <Route path="/login">
            <LoginForm />
          </Route>

          <Route path="/logout">
            <LogoutForm />
          </Route>

          <Route path="/register">
            <RegisterForm />
          </Route>

          <Route path="/create">
            <PublicationCreate />
          </Route>

          <Route path="/topic-add">
            <TopicForm />
          </Route>

          <Route path="/profile/:id">
              <Profile />
          </Route>

          <Route path="/:id">
              <PublicationDetail />
          </Route>

          <Route path="/">
            <PublicationList />
          </Route>
          
        </Switch>
      </div>
    </Router>

    </div>
  );
}

export default App;
