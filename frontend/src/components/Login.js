import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import {Entry, Input, Label, ButtonS} from '../styled-components/CreatePub';
import { Link } from "react-router-dom";

import env from "react-dotenv";


const LoginForm = () => {
    const { handleSubmit, register, errors } = useForm();

    const onSubmit = values => {
        axios({
            method: 'post',
            url: `${env.API_URL}/login`,
            data: values
          }).then(
            //Redirect to home
            //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
            window.location.href = "/"
          );
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
                required: "Required",
              })}
            />
          </Entry>
          {errors.email && errors.email.message}

          <Entry>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              ref={register({
                required: "Required",
              })}
            />
          </Entry>
          {errors.password && errors.password.message}
        
          <ButtonS type="submit">Log In</ButtonS>
          <Link to="/register">Don't have an account?</Link>
        </form>
        </>
      );
};

export default LoginForm;

