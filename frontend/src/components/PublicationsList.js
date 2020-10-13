import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function PublicationList(){
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pubs, setPubs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/get_posts")
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
      <div id="pub-list">
        <h1>Publications</h1>
        
        {pubs.map(pub => (
          
          <div key={pub._id}>
            <hr></hr>
            <h2>{pub.title}</h2> 
            <p>{pub.description}</p>
            <h4>Upvotes: {pub.upvotes}</h4>
            <ul id="topics-individual">
              {pub.topics.map(topic => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
            <Link to={pub._id}>Detail</Link>
          </div>
        ))}
      </div>
    );
  }

}


export default PublicationList;
