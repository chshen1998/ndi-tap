import {useState, useEffect} from 'react';
import axios from 'axios';
import {API_URL} from "../config/config"
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import myinfo from '../assets/myinfo.png'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '20%',
  };

var authApiUrl; // URL for authorise API
var clientId; // your app_id/client_id provided to you during onboarding
var redirectUrl; // callback url for your application
var purpose; // The purpose of your data retrieval
var state = Math.floor(Math.random() * 100000); // Identifier that represents the user's session with the client (for testing - andomly generated state)
var attributes; // the attributes you are retrieving for your application to fill the form
var securityEnable; // the auth level, determines the flow
var environment;

const Login = () => {
    useEffect(() => {
        axios.get(API_URL + '/getEnv').then((response) => {
            clientId = response.data.clientId;
            redirectUrl = response.data.redirectUrl;
            attributes = response.data.attributes;
            purpose = response.data.purpose;
            environment = response.data.environment;
            authApiUrl = response.data.authApiUrl;
        })
    }, []);

     // ---START---AUTH API---
    const callAuthoriseApi = () => {
        var authoriseUrl = authApiUrl + "?client_id=" + clientId +
            "&attributes=" + attributes +
            "&purpose=" + purpose +
            "&state=" + encodeURIComponent(state) +
            "&redirect_uri=" + redirectUrl;
        console.log(redirectUrl)
       window.location = authoriseUrl;
    }
    // ---END---AUTH API---

    return (
        <div style={{ display: "flex", flexDirection: "column"}} classname='buttonGroup'>
        <br/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                <h3>Login with Singpass</h3>
            </Typography>
            <br/>
            <Button>
                <img className='logo' src={myinfo} onClick={callAuthoriseApi}/>
            </Button>
      </div>
    )
}

export default Login
