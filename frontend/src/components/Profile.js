import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import env from "react-dotenv";

import { Wrapper, Title, ButtonS, Topic, TopicList, Card, CommentButton } from "../styled-components/ListingPubs";



const Profile = () => {
    let [userFields, setUserFields] = useState({});
    let [userPubs, setUserPubs] = useState([]);
    let [showPubs, setShowPubs] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    let {id} = useParams();
    console.log(id);

    useEffect(() => {
            axios.get(`${env.API_URL}/user/${id}`)
              .then(
                (result) => {
                  setIsLoaded(true);
                  setUserFields(result.data);
                },
                (error) => {
                  setIsLoaded(true);
                  setError(error);
                }
              )

            axios.get(`${env.API_URL}/user/posts/${id}`)
              .then(
                (result) => {
                    setUserPubs(result.data);
                    console.log(result.data);
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
                        <ButtonS onClick={(e) => deletePost(e, pub._id)}>DELETE</ButtonS>
                    </Card>
                    ))}
                </Wrapper>
            }
            </>
          );
      }

};

export default Profile;