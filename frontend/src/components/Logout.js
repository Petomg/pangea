import React, { useEffect } from "react";
import axios from 'axios';

import env from "react-dotenv";

import Cookies from 'universal-cookie';
const cookies = new Cookies();


const LogoutForm = () => {
    
    useEffect(() => {
        axios({
            method: 'post',
            url: `${env.API_URL}/logout`,

          }).then( () => {
            cookies.remove('nToken', { path: '/' });
            //Redirect to home
            //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
            window.location.href = "/";
        });

      }, [])

      return null;
};

export default LogoutForm;

