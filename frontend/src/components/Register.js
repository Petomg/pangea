import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import {Entry, Input, Label, ButtonS} from '../styled-components/CreatePub';

import env from "react-dotenv";


const RegisterForm = () => {
    const { handleSubmit, register, errors } = useForm();

    const onSubmit = values => {
        axios({
            method: 'post',
            url: `${env.API_URL}/register`,
            data: values
          }).then(
            //Redirect to home
            //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
            window.location.href = "/"
          );
    }

    return (
        <>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Entry>
            <Label>Name</Label>
            <Input
              name="name"
              ref={register({
                required: "Required",
              })}
            />
          </Entry>
          {errors.name && errors.name.message}

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

          <Entry>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="password2"
              ref={register({
                required: "Required",
              })}
            />
          </Entry>
          {errors.password2 && errors.password2.message}
        
          <ButtonS type="submit">Sign Up</ButtonS>
        </form>
        </>
      );
};

export default RegisterForm;

