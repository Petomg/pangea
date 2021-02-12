import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useParams, Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Title, Wrapper, ButtonS, TopicList, Topic, CommentSection, CommentBox, CommentIndiv, CommentButton } from "../styled-components/ListingPubs";
import * as general from "../operational/general_functionality";

import env from "react-dotenv";

import Urn from "./Urn";

function PublicationDetail(){
    const { handleSubmit, register, errors } = useForm();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pubFields, setPubFields] = useState({});
    const [topics, setTopics] = useState([]);
    const [comments, setComments] = useState([]);
  

    let {id} = useParams();

    const addComment = values => {
        axios({
          method: 'post',
          url: `${env.API_URL}/comments/${id}`,
          data: values
        }).then(
          //Redirect to home
          //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
          window.location.href = `/${id}`
        );
    }

    useEffect(() => {
        axios.get(`${env.API_URL}/get_posts/${id}`)
        .then(
            (result) => {
              setIsLoaded(true);
              setPubFields(result.data);
              setTopics(result.data.topics);
              setComments(result.data.comments);
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
            <Wrapper className="pub-detail">
                <Title>{pubFields.title}</Title>
                {pubFields.author !== undefined &&
                  <p>User: {pubFields.author.name}</p>
                }
                <b>{general.formatDate(pubFields.createdAt)}</b>
                <p>{pubFields.description}</p>
                <h4>VOTES: {pubFields.upvotes}</h4>
                <ButtonS primary onClick={(e) => sendUpvote(e, pubFields.upvotes, pubFields._id)}>VOTE</ButtonS>
                
                <TopicList id="topics-detail">
                {topics.map(topic => (
                  <Topic key={topic}>{topic}</Topic>
                ))}
                </TopicList>

                {pubFields.author !== undefined && general.checkUserValid(pubFields.author._id) &&
                  <ButtonS onClick={(e) => deletePost(e, pubFields._id)}>DELETE</ButtonS>
                }
                <Urn urnid={pubFields.urn}></Urn>


                
                <CommentSection onSubmit={handleSubmit(addComment)}>
                  <h2>Opinions</h2>
                  <CommentBox 
                    name="content"
                    ref={register} 
                    placeholder="Your comment...">
                  </CommentBox>
                  {errors.content && errors.content.message}
                  
                  <div>
                    <CommentButton type="submit">Save</CommentButton>
                  </div>

                  {comments.map(comment => (
                      <CommentIndiv>
                        <i className="date-comment">{general.formatDate(comment.createdAt)}</i>
                        <p key={comment._id}>{comment.content}</p>
                      </CommentIndiv>
                  ))}

                </CommentSection>
            </Wrapper>
        );
    }


  // Funcion que maneja el upvote.
  function sendUpvote(event, currUps, id){
    axios({
      method: 'post',
      url: `${env.API_URL}/upvote_post/${id}`,

    });

    setPubFields({...pubFields, upvotes: currUps + 1});
    
  }

  function deletePost(event, id){
    axios({
      method: 'post',
      url: `${env.API_URL}/delete_post/${id}`,
    }).then(
        //Redirect to home
        window.location.href = "/"
    );
    
  }
}

export default PublicationDetail;