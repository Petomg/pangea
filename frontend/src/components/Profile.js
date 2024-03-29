import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import env from "react-dotenv";
import ImageUploader from 'react-images-upload';

import { Wrapper, Title, ButtonS, Topic, TopicList, Card, CommentButton } from "../styled-components/ListingPubs";
import { FriendTag } from "../styled-components/ProfileStyles";

import * as general from "../operational/general_functionality";

import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Profile = () => {
    let [userFields, setUserFields] = useState({});
    let [userPubs, setUserPubs] = useState([]);
    let [picture, setPicture] = useState();
    let [showPubs, setShowPubs] = useState(false);
    let [showPending, setShowPending] = useState(false);
    let [showFriends, setShowFriends] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    let {uname} = useParams();
    
    useEffect(() => {
           
            axios.get(`${env.API_URL}/user/profile/${uname}`, {withCredentials: true})
              .then(
                (result) => {
                  setIsLoaded(true);
                  setUserFields(result.data);
                  console.log(result.data);
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
    
    let loadPendingFriends = () => {
      setShowPending(true);
    }

    let loadFriends = () => {
      setShowFriends(true);
    }

    //Se entiende que es solicitud del logueado al del perfil
    let addAsFriend = () => {
      axios({
        method: "post",
        url:`${env.API_URL}/user/add_friend/${userFields._id}`,
        withCredentials: true
      })
    }

    let acceptFriend = (e, fid) => {
      e.preventDefault();
      axios({
        method: "post",
        url:`${env.API_URL}/user/confirm_friend/${userFields._id}`,
        data: {
          friend_id: fid
        },
        withCredentials: true
      }).then ( (result) => {
        setUserFields(result.data);
      })
    }

    let declineFriend = (e, fid) => {
      e.preventDefault();
      axios({
        method: "post",
        url:`${env.API_URL}/user/decline_friend/${userFields._id}`,
        data: {
          friend_id: fid
        },
        withCredentials: true
      }).then( (result) => {
        setUserFields(result.data);
      });
    }

    let unFriend = (e, fid) => {
      e.preventDefault();
      axios({
        method: "post",
        url:`${env.API_URL}/user/delete_friend/${userFields._id}`,
        data: {
          friend_id: fid
        },
        withCredentials: true
      }).then ( (result) => {
          setUserFields(result.data);
      })
    }

    function deletePost(event, id, authorid){
        axios({
          method: 'post',
          url: `${env.API_URL}/delete_post/${id}`,
          withCredentials: true,
          data: {
            author_id: authorid,
          }
        }).then(
            //Redirect to home
            window.location.href = "/"
        );
        
    }
  
    let uploadPicture = (pic) => {
      console.log(pic[0]);
      setPicture(pic[0]);
      let fileName = pic[0].name;
      let contentType = pic[0].type;
      axios({
        method: "post",
        url:`${env.API_URL}/images`,
        data: {
          fileName: fileName,
          contentType: contentType
        }
      })
    }



    if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
          return (
            <>
                
                <h1>{userFields.name}</h1>
                <h4>{general.getReputation(userFields.reputation)}</h4>
                <h3>{userFields.email}</h3>

                <div className="needs-space">
                  {!general.checkUserValid(userFields._id) && general.isLoggedIn() &&
                    <ButtonS primary onClick={addAsFriend}>Add Friend +</ButtonS>
                  }  
                </div>

                {general.checkUserValid(userFields._id) &&
                <>

                <div>
                  <CommentButton onClick={loadPendingFriends}>Show me my pendings madafaka</CommentButton>
                  {showPending && 
                    <div>
                    {userFields.pending_friends.map( friend => (
                      <FriendTag key={friend._id}>
                        <Link to={"/profile/" + friend.name} className="friend-tag">{friend.name}</Link>
                        <img className="icon-pending" src={require('../imgs/check-icon.png')} alt="Accept" onClick={(e) => acceptFriend(e, friend._id)}></img>
                        <img className="icon-pending" src={require('../imgs/decline-icon1.png')} alt="Decline" onClick={(e) => declineFriend(e, friend._id)}></img>
                      </FriendTag>
                    ))}
                  </div>
                  }
                </div>

                </>
                }
                
                <div>
                  <CommentButton onClick={loadFriends}>Show me my friends madafaka</CommentButton>
                  {showFriends && 
                    <div>
                    {userFields.friends.map( friend => (
                      <FriendTag key={friend._id}>
                        <Link to={"/profile/" + friend.name} className="friend-tag">{friend.name}</Link>
                        {general.checkUserValid(userFields._id) &&
                          <ButtonS onClick={(e) => unFriend(e, friend._id)}>Un-Friend</ButtonS>
                        }
                      </FriendTag>
                    ))}
                    </div>
                  }
                </div>
                
            
                <div>
                  <CommentButton onClick={loadPublications}>Show me my publications madafaka</CommentButton>
              
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
                                <ButtonS onClick={(e) => deletePost(e, pub._id, pub.author)}>DELETE</ButtonS>
                              }
                              <ButtonS primary href={"/" + pub._id}>Detail</ButtonS>
                          </Card>
                          ))}

                      </Wrapper>
                  }
                </div>

              <ImageUploader
                withIcon={true}
                buttonText='Choose images'
                onChange={(pic) => uploadPicture(pic)}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
              />
            </>
          );
      }

};

export default Profile;