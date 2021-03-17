import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Wrapper, Title, ButtonS, Topic, TopicList, Card, Banner, BannerBtn } from "../styled-components/ListingPubs";

import env from "react-dotenv";

function PublicationList(){
  const { handleSubmit, register, errors } = useForm();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pubs, setPubs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [toggleTopics, setToggleTopics] = useState(false);
 
  const onSubmit = values => { 
    // Reareglar valores para acomodar topics en array 
    let ctopics = [];
    for(let prop in values){
      if((prop.localeCompare("title") != 0 && prop.localeCompare("description") != 0)) {
        if (values[prop]){
          ctopics.push(prop);
        }
        delete values[prop];
      }
      values["topics"] = ctopics;
    }

    console.log(values);

    axios.get(`${env.API_URL}/posts_by_topics`, {
      params: {
        topics: values.topics
      }
    }).then( (pubs) => {
        setPubs(pubs.data);
    });
  }

  useEffect(() => {
    axios.get(`${env.API_URL}/get_posts`)
      .then(
        (result) => {
          setIsLoaded(true);
          setPubs(result.data);
          axios.get(`${env.API_URL}/topics`)
          .then(
            (res) => {
              console.log(res.data);
              setTopics(res.data);
            }
          )
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
      <div className="to-close-to-top">
        <ButtonS primary onClick={() => setToggleTopics(!toggleTopics)}>+ Filter by Topics</ButtonS>
        {toggleTopics && 
          <form onSubmit={handleSubmit(onSubmit)} className="needs-space">
            {topics.map(topic => (
                      <div key={topic._id} class="topic-select">
                        <Topic for={"t_".concat(topic.name.toLowerCase())} className="topic-label">{topic.name} </Topic>
                        <input id={"t_".concat(topic.name.toLowerCase())} className="topic-check" type="checkbox" placeholder={topic.name} name={topic.name} ref={register} /> <br></br>
                      </div>
                  ))}
            <button type="submit">Search</button>
          </form>
        }
      </div>

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
