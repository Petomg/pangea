import React, { useState, useEffect } from "react";
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useParams, Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Title, Wrapper, ButtonS, TopicList, Topic, CommentSection, CommentBox, CommentIndiv, CommentButton, SubComments } from "../styled-components/ListingPubs";
import * as general from "../operational/general_functionality";

import env from "react-dotenv";

import Urn from "./Urn";


import Cookies from 'universal-cookie';
const cookies = new Cookies();


function PublicationDetail(){
    const { handleSubmit, register, errors } = useForm();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pubFields, setPubFields] = useState({});
    const [topics, setTopics] = useState([]);
    const [comments, setComments] = useState([]);
    const [idResponding, setIdResponding] = useState("");
  
    let {id} = useParams();
    
    const addComment = values => {
        axios({
          method: 'post',
          url: `${env.API_URL}/comments/${id}`,
          data: {author: cookies.get("nToken"),
                values}
        }).then(
          //Redirect to home
          //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
          window.location.href = `/${id}`
        );
    }

    const addSubComment = values => {
      axios({
        method: 'post',
        url: `${env.API_URL}/comments/sub/${values.cid}`,
        data: {
              author: cookies.get("nToken"),
              content: values.content
              }
      }).then(
        //Redirect to home
        //DUDOSO ESTE REDIRECT (ES BUENA PRACTICA?)
        window.location.href = `/${id}`
      );
    }

    const toggleCommentBox = (e, cid) => {
      e.preventDefault();
      setIdResponding(cid);
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
                 <p>User: <Link to={`/profile/${pubFields.author.name}`}>{pubFields.author.name}</Link></p>
                }
                <b>{general.formatDate(pubFields.createdAt)}</b>
                <p>{pubFields.description}</p>
                <h4>VOTES: {pubFields.upvotes}</h4>
                {general.isLoggedIn() && 
                  <ButtonS primary onClick={(e) => sendUpvote(e, pubFields._id)}>VOTE</ButtonS>
                }
                <TopicList id="topics-detail">
                {topics.map(topic => (
                  <Topic key={topic}>{topic}</Topic>
                ))}
                </TopicList>

                
                <Urn urnid={pubFields.urn}></Urn>


                
                <CommentSection onSubmit={handleSubmit(addComment)}>
                  <h2>Opinions</h2>
                  {general.isLoggedIn() &&
                    <>
                    <CommentBox 
                      name="content"
                      ref={register} 
                      placeholder="Your comment...">
                    </CommentBox>
                    {errors.content && errors.content.message}
                    
                    <div>
                      <CommentButton type="submit">Save</CommentButton>
                    </div>
                    </>
                  }
                </CommentSection>

                  {comments.map(comment => (
                      <>
                        <CommentComponent comment={comment} />

                        {idResponding !== comment._id &&
                          <button onClick={(e) => toggleCommentBox(e, comment._id)}>Respond</button>
                        }
                        {idResponding == comment._id &&
                          <form onSubmit={handleSubmit(addSubComment)}>
                            <CommentBox 
                              name="content"
                              ref={register} 
                              placeholder="Your comment...">
                            </CommentBox>
                            {errors.content && errors.content.message}
                            <input id="cid" name="cid" type="hidden" ref={register} value={comment._id}></input>
                            <div>
                              <button type="submit">Save</button>
                            </div>
                          </form>
                        }
                        
                        {comment.subcomments.map(subcomment => (
                          <SubComments>
                            <CommentComponent comment={subcomment} parent={comment.author.name}/>
                          </SubComments>
                        ))}
                  
                      </>
                  ))}
            </Wrapper>
        );
    }


  // Funcion que maneja el upvote.
  function sendUpvote(event, id){
    axios({
      method: 'post',
      url: `${env.API_URL}/upvote_post/${id}`,
      data: {
        author: cookies.get("nToken")
      }

    }).then( (res) => {
      setPubFields({...pubFields, upvotes: res.data});
    });

    
    
  }

}

const CommentComponent = (props) => {
  return (
    <CommentIndiv>
      {props.parent && 
       <>
       <p class="addressing">@{props.parent}</p><b> :: </b>
       </>
      }
      {props.comment.author !== undefined && 
        <b><Link to={`/profile/${props.comment.author.name}`}>{props.comment.author.name}</Link> :: </b>
      }
      <i className="date-comment">{general.formatDate(props.comment.createdAt)}</i>
      <p key={props.comment._id}>{props.comment.content}</p>
    </CommentIndiv>
  )
}

export default PublicationDetail;