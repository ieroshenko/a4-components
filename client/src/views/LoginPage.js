import React, {useEffect, useState} from "react";
import Axios from "axios";
import {Redirect} from "react-router-dom";
import GithubButton from 'react-github-login-button'

const LoginPage = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(-1)

    useEffect(() => {
        Axios.get('/api/authCheck').then((res) => {
            console.log(res);
            setIsAuthenticated(1);
        }).catch((e) => {
            console.log('error:', e);
            setIsAuthenticated(0);
        })
    }, []);

    const handleLoginWithGitHub = () => {
        window.open("/auth/github", "_self");
    };


    return (
        <>
            {isAuthenticated === -1 ? <div>Waiting</div> :
                (isAuthenticated === 1 ? <Redirect to={{pathname: '/home'}}/> :
                    <div className="login-page">
                        <div className="login-container">
                            <div className="login text">LOGIN</div>
                            <div className="desc text"> Login to start tracking your miles</div>
                            <GithubButton onClick={handleLoginWithGitHub}/>
                        </div>
                    </div>)}
        </>
    )
}

export default LoginPage
