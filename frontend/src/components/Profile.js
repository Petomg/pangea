import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import env from "react-dotenv";

import { Wrapper, Title, ButtonS, Topic, TopicList, Card, CommentButton } from "../styled-components/ListingPubs";

import * as general from "../operational/general_functionality";


const Profile = () => {
    let [userFields, setUserFields] = useState({});
    let [userPubs, setUserPubs] = useState([]);
    let [showPubs, setShowPubs] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    let {uname} = useParams();
    
    useEffect(() => {
           
            axios.get(`${env.API_URL}/user/profile/${uname}`)
              .then(
                (result) => {
                  setIsLoaded(true);
                  setUserFields(result.data);

                  axios.get(`${env.API_URL}/user/posts/${result.data._id}`)
                  .then(
                    (result) => {
                        setUserPubs(result.data);
                    }
                  )
                },
                (error) => {
                  setIsLoaded(true);
                  setError(error);
                }
              )
            
            
            
    }, []);

    let loadPublications = () => {
       setShowPubs(true);
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


    if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
          return (
            <>
            <div>
                <h1>{userFields.name}</h1>
                <h3>{userFields.email}</h3>
                <CommentButton onClick={loadPublications}>Show me my publications madafaka</CommentButton>
            </div>
            {userPubs !== [] && showPubs &&
                <Wrapper id="pub-list">
                    {userPubs.map( pub => (
                        <Card key={pub._id}>
                        <Title>{pub.title}</Title> 
                        <p>{pub.description}</p>
                        <h4>VOTES: {pub.upvotes}</h4>
                        <TopicList id="topics-individual">
                        {pub.topics.map(topic => (
                            <Topic key={topic}>{topic}</Topic>
                        ))}
                        </TopicList>
                        {general.checkUserValid(userFields._id) &&
                          <ButtonS onClick={(e) => deletePost(e, pub._id)}>DELETE</ButtonS>
                        }
                        <ButtonS primary href={"/" + pub._id}>Detail</ButtonS>
                    </Card>
                    ))}
                </Wrapper>
            }
            </>
          );
      }

};

export default Profile;