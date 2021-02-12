import React, { useState } from "react";
import axios from 'axios';
import {Entry, Input, Label, ButtonS} from '../styled-components/CreatePub';
import { useForm } from "react-hook-form";

import env from "react-dotenv";

function TopicAdd () {
    const { handleSubmit, register, errors } = useForm();

    const onSubmit = values => {
        axios({
            method: 'post',
            url: `${env.API_URL}/topics`,
            data: values
          }).then(
            //Redirect to home
            //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
            //window.location.href = "/"
          );
    }

    return (
        <>
            <h1>Add Topic</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Entry>
                    <Label>Topic Name</Label>
                    <Input
                        name="topicname"
                        ref={register({
                            required: "Required",
                        })}
                    />
                </Entry>
                {errors.topicname && errors.topicname.message}
                
                <ButtonS type="submit">Submit</ButtonS>

            </form>
        </>
    );
}

export default TopicAdd;