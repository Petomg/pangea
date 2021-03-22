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
    const [showResponses, setShowResponses] = useState([]);
    const [orderedby, setOrderedby] = useState("New Comments");

    const CommentComponent = (props) => {

      return (
        <CommentIndiv>
          {props.parent && 
          <>
          <p className="addressing">@{props.parent}</p><b> :: </b>
          </>
          }
          {props.comment.author !== undefined && 
          <>
            <Link className="user-tag-comment" to={`/profile/${props.comment.author.name}`}>{props.comment.author.name}</Link> :: 
          </>
          }
          <i className="date-comment">{general.formatDate(props.comment.createdAt)}</i>
         
          <p key={props.comment._id}>{props.comment.content}</p>
          <div className="up-comment">
            <p className="up-comment-num">{props.comment.upvotes}</p>
            {general.isLoggedIn() && 
              <button className="up-comment-button" onClick={(e) => sendCommentUpvote(e, props.comment)}>UP</button>
            }
          </div>
        </CommentIndiv>
      )
    
      function sendCommentUpvote(event, comment){
        event.preventDefault();
        axios({
          method: 'post',
          url: `${env.API_URL}/comments/upvote/${comment._id}`,
          withCredentials: true
      
        }).then( (res) => {
          comment.upvotes = res.data;
          let newComments = [...comments]
          setComments(newComments);
        });
      }
    }

    const orderByUpvotes = () => {
      function compareUpvotes( a, b ) {
        if ( a.upvotes < b.upvotes ){
          return 1;
        }
        if ( a.upvotes > b.upvotes ){
          return -1;
        }
        return 0;
      }
  
      let newOrder = [...comments];
  
      newOrder.sort(compareUpvotes);
  
      setComments(newOrder);

      setOrderedby("Top Comments");
  
    }


    const orderByNewer = () => {
      function compareDates( a, b ) {
        let date1 = new Date(a.createdAt);
        let date2 = new Date(b.createdAt);
        if ( date1 < date2 ){
          return 1;
        }
        if ( date1 > date2 ){
          return -1;
        }
        return 0;
      }

      let newOrder = [...comments];

      newOrder.sort(compareDates);

      setComments(newOrder);

      setOrderedby("New Comments");

    }
    
    let {id} = useParams();

      // Funcion que maneja el upvote.
    const sendUpvote = (event, id) => {
      axios({
        method: 'post',
        url: `${env.API_URL}/upvote_post/${id}`,
        withCredentials: true

      }).then( (res) => {
        setPubFields({...pubFields, upvotes: res.data});
      });
    }
    
    const addComment = values => {
        axios({
          method: 'post',
          url: `${env.API_URL}/comments/${id}`,
          data: values,
          withCredentials: true
        }).then( (newComment) => {
          setComments([newComment.data, ...comments]);
        }
        );
    }

    const addSubComment = values => {
      values.comment = JSON.parse(values.comment);
      axios({
        method: 'post',
        url: `${env.API_URL}/comments/sub/${values.comment._id}`,
        data: {content: values.content},
        withCredentials: true
      }).then( (newComment) => {
        for (let com of comments){
          if (com._id === values.comment._id){
            com.subcomments.unshift(newComment.data);
          }
        }
        let newComments = [...comments]
        setComments(newComments);
      }
      );
    }

    const toggleCommentBox = (e, cid) => {
      e.preventDefault();
      setIdResponding(cid);
    }

    const toggleResponses = (e, cid) => {
      e.preventDefault();
      let newArr = []
      if(showResponses.includes(cid)){
        newArr = [...showResponses];
        newArr.splice(newArr.indexOf(cid));
      } else {
        newArr = [...showResponses, cid];
      }
      setShowResponses(newArr);
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
                <h2>{pubFields.isClosed && "CLOSED" || "OPEN"}</h2>
                {pubFields.author !== undefined && 
                 <Link className="user-tag" to={`/profile/${pubFields.author.name}`}>{pubFields.author.name}</Link>
                }
                <b className="date-tag">{general.formatDate(pubFields.createdAt)}</b>
                <p>{pubFields.description}</p>
                <p><p className="upvotes-indicator">{pubFields.upvotes}</p></p>
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
                  <div className="dropdown">
                    <button className="dropbtn">{orderedby}</button>
                    <div className="dropdown-content">
                      <a onClick={orderByUpvotes}>Top Comments</a>
                      <a onClick={orderByNewer}>New Comments</a>
                    </div>
                  </div>
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
                          <button className="small_button" onClick={(e) => toggleCommentBox(e, comment._id)}>Respond</button>
                        }
                        {idResponding == comment._id &&
                          <form onSubmit={handleSubmit(addSubComment)}>
                            <CommentBox 
                              name="content"
                              ref={register} 
                              placeholder="Your comment...">
                            </CommentBox>
                            {errors.content && errors.content.message}
                            <input id="comment" name="comment" type="hidden" ref={register} value={JSON.stringify(comment)}></input>
                            <div>
                              <button className="small_button" type="submit">Save</button>
                            </div>
                          </form>
                        }
                        
                        <button className="small_button" onClick={(e) => toggleResponses(e, comment._id)}>
                          {showResponses.includes(comment._id) && "Hide" || "Show"} responses
                        </button>
                        
                        {showResponses.includes(comment._id) && 
                          <>
                          {comment.subcomments.map(subcomment => (
                            <SubComments>
                              <CommentComponent comment={subcomment} parent={comment.author.name}/>
                            </SubComments>
                          ))}
                          </>
                        }
                  
                      </>
                  ))}
            </Wrapper>
        );
    }
}



export default PublicationDetail;