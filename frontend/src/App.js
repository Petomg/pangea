import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NavBar, NavBarItem } from './styled-components/NavBar';
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

import Cookies from 'universal-cookie';
const cookies = new Cookies();

function App() {
  return (
    <div className="App">
       <Router>
      <div>
        <nav>
          <NavBar>
            <div>
            <NavBarItem>
              <Link to="/" className="perso-link">Home</Link>
            </NavBarItem>
            <NavBarItem>
              <Link to="/create" className="perso-link">Create Publication</Link>
            </NavBarItem>
            </div>
            <div>
              {!cookies.get("nToken") &&
                <NavBarItem>
                  <Link to="/login" className="perso-link">Log in</Link>
                </NavBarItem>
              }
              {cookies.get("nToken") &&
                <NavBarItem>
                  <Link to="/logout" className="perso-link">Logout</Link>
                </NavBarItem>
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
