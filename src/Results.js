import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './results.css';

// useLocation is a hook from react-router-dom that provides access to the location object which contains information about the current URL.
// useNavigate is a hook from react-router-dom that returns a navigate function that can be used to programmatically navigate.
// useState is a hook from React that lets you add React state to function components.
// isConnected is a boolean that checks if the FastAPI is connected.
// status is a variable that holds the status of the data.
// results is an object that holds the results of the data.

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state.query;
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Check if the FastAPI is connected when the component is mounted
    fetch('http://localhost:8000/search')
      .then(response => {
        if (response.ok) {
          setIsConnected(true);
          // Ping /status and wait for the "id" and "status"
          const interval = setInterval(() => {
            fetch('http://localhost:8000/status')
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                setStatus(data.status);
                setResults(data.results);
                if (data.status === 'completed') {
                  clearInterval(interval);
                }
              })
              .catch(error => {
                console.log('Fetching status failed: ', error);
                clearInterval(interval);
              });
          }, 4000); // Check every 4 seconds
        } else {
          setIsConnected(false);
        }
      })
      .catch(error => {
        console.log('Fetching search failed: ', error);
        setIsConnected(false);
      });
  }, []);

  const handleStartOver = () => {
    navigate('/');
  }

  return (
    <div className="Results">
      <p className="connectionstatus inline-flex flex justify-center items-center center-horizontal">
        <span className={isConnected ? 'status-icon connected' : 'status-icon not-connected'}></span>
        {isConnected ? 'Connected' : 'Not Connected'}
      </p>
      <h1 className="center-horizontal queryresult">"{query}"</h1>
      <p>Status: {status}</p>
      {status === 'completed' && results.map((result, index) => (
        <div className="result-box" key={index}>
          <p className='resulttextmain'>Result: {result.result}</p>
          <p>Chunk ID: {result.chunk_id}</p>
          <p>Location: {result.location}</p>
          <p>Score: {result.score}</p>
        </div>
      ))}
      <button onClick={handleStartOver}>Start Over</button>
    </div>
  );
}

export default Results;