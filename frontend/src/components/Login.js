import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import {Entry, Input, Label, ButtonS} from '../styled-components/CreatePub';
import { Link } from "react-router-dom";

import Cookies from 'universal-cookie';


import env from "react-dotenv";

const cookies = new Cookies();

const LoginForm = () => {
    const { handleSubmit, register, errors } = useForm();

    const onSubmit = values => {
        axios({
            method: 'post',
            url: `${env.API_URL}/login`,
            data: values,
          },{
            withCredentials: true,
            credentials: 'include'
          }).then( (dataBack) => {

            cookies.set('nToken', dataBack.data.token, { path: '/' });
            //Redirect to home
            //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
            window.location.href = "/";
          });
    }

    return (
        <>
        <h1>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Entry>
            <Label>Email</Label>
            <Input
              name="email"
              ref={register({
                required: "Please specify your username",
              })}
            />
            <p className="simple_error_msg">{errors.email && errors.email.message}</p>
          </Entry>
          

          <Entry>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              ref={register({
                required: "Please specify your password",
              })}
            />
            <p className="simple_error_msg">{errors.password && errors.password.message}</p>
          </Entry>
          
        
          <ButtonS type="submit">Log In</ButtonS>
          <Link to="/register">Don't have an account?</Link>
        </form>
        </>
      );
};

export default LoginForm;

