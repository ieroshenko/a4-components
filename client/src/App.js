import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";

// When going to any route check auth status on back-end and take action accordingly
// https://medium.com/javascript-in-plain-english/how-to-set-up-protected-routes-in-your-react-application-a3254deda380
// api route ref - https://github.com/leannezhang/twitter-authentication

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/home" component={HomePage}/>
                    <Route exact path="/login" component={LoginPage}/>
                    <Route exact path="/" component={HomePage}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
