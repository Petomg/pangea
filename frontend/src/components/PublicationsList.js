import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Wrapper, Title, ButtonS, Topic, TopicList, Card, Banner, BannerBtn } from "../styled-components/ListingPubs";
import { TopicLabel } from "../styled-components/CreatePub";

import env from "react-dotenv";

function PublicationList(){
  const { handleSubmit, register, errors } = useForm();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pubs, setPubs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [toggleTopics, setToggleTopics] = useState(false);
  const [orderedby, setOrderedby] = useState("New Debates");

 
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
        let publics = pubs.data.reverse();
        setPubs(publics);
    });
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

    let newOrder = [...pubs];

    newOrder.sort(compareUpvotes);

    setPubs(newOrder);

    setOrderedby("Top Debates");

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

    let newOrder = [...pubs];

    newOrder.sort(compareDates);

    setPubs(newOrder);

    setOrderedby("New Debates");

  }

  const selectAll = () => {
      let checkboxes = document.getElementsByClassName('topic-check');
      let selectAll = document.getElementsByName('selectAll')[0];
      for(let checkbox of checkboxes)
        checkbox.checked = selectAll.checked;
  }

  useEffect(() => {
    axios.get(`${env.API_URL}/get_posts`)
      .then(
        (result) => {
          setIsLoaded(true);
          let reversePubs = result.data.reverse();
          setPubs(reversePubs);
          axios.get(`${env.API_URL}/topics`)
          .then(
            (res) => {
              
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
            <label className="selectall-label" for="selectAll">Whatever</label>
            <input id="selectAll" type="checkbox" name="selectAll" onClick={selectAll} />
            {topics.map(topic => (
                      <div key={topic._id} class="topic-select">
                        <TopicLabel for={"t2_".concat(topic.name.toLowerCase())} className="topic-label">{topic.name} </TopicLabel>
                        <input id={"t2_".concat(topic.name.toLowerCase())} className="topic-check" type="checkbox" placeholder={topic.name} name={topic.name} ref={register} /> <br></br>
                      </div>
                  ))}
            <button type="submit" className="small_button">Search</button>
          </form>
        }
      </div>
      <div className="to-close-to-top">
        <div className="dropdown">
                    <button className="dropbtn">{orderedby}</button>
                    <div className="dropdown-content">
                      <a onClick={orderByUpvotes}>Top Debates</a>
                      <a onClick={orderByNewer}>New Debates</a>
                    </div>
        </div>
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
