import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Wrapper, Title, ButtonS, Topic, TopicList, Card, Banner, BannerBtn } from "../styled-components/ListingPubs";

import env from "react-dotenv";

function PublicationList(){
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pubs, setPubs] = useState([]);

  useEffect(() => {
    axios.get(`${env.API_URL}/get_posts`)
      .then(
        (result) => {
          setIsLoaded(true);
          setPubs(result.data);
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
      <Banner>
        <BannerBtn href='/create'>Tirate un debate Pa</BannerBtn>
      </Banner> 
      <Wrapper id="pub-list">
        
        {pubs.map(pub => ( 

          <Card key={pub._id}>
            <Title>{pub.title}</Title> 
            <p>{pub.description}</p>
            <h4 className="upvotes-indicator">{pub.upvotes}</h4>
            <TopicList id="topics-individual">
              {pub.topics.map(topic => (
                <Topic key={topic}>{topic}</Topic>
              ))}
            </TopicList>
            <ButtonS primary href={pub._id}>Detail</ButtonS>
          </Card>
        ))}
      </Wrapper>
      </>
    );
  }

}


export default PublicationList;
