import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import {Entry, Input, Label, ButtonS, TextArea, Topic} from '../styled-components/CreatePub';

import '../App.css';


const PublicationCreate = () => {
  const { handleSubmit, register, errors } = useForm();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [topics, setTopics] = useState([]);

  const onSubmit = values => { 
      // Reareglar valores para acomodar topics en array 
      let ctopics = [];
      for(let prop in values){
        if((prop.localeCompare("title") != 0 && prop.localeCompare("description") != 0)) {
          if (values[prop]){
            ctopics.push(prop);
          }
          delete values[prop];
        }
        values["topics"] = ctopics;
      }

      console.log(values);

      axios({
        method: 'post',
        url: 'http://localhost:5000/add_post',
        data: values
      }).then(
        //Redirect to home
        //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
        window.location.href = "/"
      );
    }

  
    useEffect(() => {
      axios.get("http://localhost:5000/topics")
        .then(
          (result) => {
            setIsLoaded(true);
            setTopics(result.data);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, []);
  
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
        return (
          <>
          <h1>Add new Debate</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Entry>
              <Label>Title</Label>
              <Input
                name="title"
                ref={register({
                  required: "Required",
                })}
              />
            </Entry>
            {errors.title && errors.title.message}

            <Entry>    
              <Label>Description</Label>
              <TextArea
                name="description"
                ref={register}
              ></TextArea>
            </Entry>
            {errors.description && errors.description.message}
            <Entry>    

            {topics.map(topic => (
                <div key={topic._id}>
                  <Topic for={"t_".concat(topic.name.toLowerCase())} className="topic-label">{topic.name} </Topic>
                  <input id={"t_".concat(topic.name.toLowerCase())} className="topic-check" type="checkbox" placeholder={topic.name} name={topic.name} ref={register} /> <br></br>
                </div>
            ))}
            
            </Entry>    
          
            <ButtonS type="submit">Submit</ButtonS>
          </form>
          </>
        );
    }
};


export default PublicationCreate;
