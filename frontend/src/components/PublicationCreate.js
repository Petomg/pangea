import React from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import {Entry, Input, Label, ButtonS, TextArea} from '../styled-components/CreatePub';


const PublicationCreate = () => {
  const { handleSubmit, register, errors } = useForm();
  const onSubmit = values => { 
      console.log(values);
      // Reareglar valores para acomodar topics en array 
      let topics = [];
      for(let prop in values){
        if(prop.substring(0,5).localeCompare("topic") == 0){
          if (values[prop]){
            topics.push(prop);
          }
          delete values[prop];
        }
        values["topics"] = topics;
      }

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
      <Label>topic1</Label>
      <input type="checkbox" placeholder="topic1" name="topic1" ref={register} /> <br></br>
      <Label>topic2</Label>
      <input type="checkbox" placeholder="topic2" name="topic2" ref={register} /> <br></br>
      <Label>topic3</Label>
      <input type="checkbox" placeholder="topic3" name="topic3" ref={register} /> <br></br>
      <Label>topic4</Label>
      <input type="checkbox" placeholder="topic4" name="topic4" ref={register} /> <br></br>
      </Entry>    
    
      <ButtonS type="submit">Submit</ButtonS>
    </form>
    </>
  );
};


export default PublicationCreate;
