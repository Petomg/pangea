import React from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';


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
        window.location.href = "/"
      );
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="title"
        ref={register({
          required: "Required",
        })}
      />
      {errors.title && errors.title.message}

      <textarea
        name="description"
        ref={register}
      ></textarea>
      {errors.description && errors.description.message}
      
      <label>topic1</label>
      <input type="checkbox" placeholder="topic1" name="topic1" ref={register} /> <br></br>
      <label>topic2</label>
      <input type="checkbox" placeholder="topic2" name="topic2" ref={register} /> <br></br>
      <label>topic3</label>
      <input type="checkbox" placeholder="topic3" name="topic3" ref={register} /> <br></br>
      <label>topic4</label>
      <input type="checkbox" placeholder="topic4" name="topic4" ref={register} /> <br></br>
    

      <button type="submit">Submit</button>
    </form>
  );
};


export default PublicationCreate;
