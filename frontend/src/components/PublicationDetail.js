import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useParams, Redirect } from 'react-router-dom';

function PublicationDetail(){
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pubFields, setPubFields] = useState({});
  

    let {id} = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/get_posts/${id}`)
        .then(
            (result) => {
              setIsLoaded(true);
              setPubFields(result.data);
              console.log(result.data);
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
            <div className="pub-detail">
                <h1>{pubFields.title}</h1>
                <i>Date: {pubFields.createdAt}</i>
                <p>{pubFields.description}</p>
                <h4>Upvotes: {pubFields.upvotes}</h4>
                <button onClick={(e) => sendUpvote(e, pubFields.upvotes, pubFields._id)}>Upvote</button>
                <button onClick={(e) => deletePost(e, pubFields._id)}>Delete</button>
                <h3>Topics:</h3>
                <ul id="topics-detail">
                    {pubFields.topics}
                </ul>


            </div>
        );
    }


  // Funcion que maneja el upvote.
  function sendUpvote(event, currUps, id){
    axios({
      method: 'post',
      url: `http://localhost:5000/upvote_post/${id}`,
      data: {
        upvotes: currUps + 1
      }
    });

    setPubFields({...pubFields, upvotes: currUps + 1});
    
  }

  function deletePost(event, id){
    axios({
      method: 'post',
      url: `http://localhost:5000/delete_post/${id}`,
    }).then(
        //Redirect to home
        window.location.href = "/"
    );
    
  }
}

export default PublicationDetail;