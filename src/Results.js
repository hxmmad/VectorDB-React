import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state.query;
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(null);
  const [results, setResults] = useState({});

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
      <p>
        <span className={isConnected ? 'status-icon connected' : 'status-icon not-connected'}></span>
        {isConnected ? 'Connected' : 'Not Connected'}
      </p>
      <h1>{query}</h1>
      <p>Status: {status}</p>
      {status === 'completed' && (
        <div>
          <p>Result: {results.result}</p>
          <p>Chunk ID: {results.chunk_id}</p>
          <p>Location: {results.location}</p>
          <p>Score: {results.score}</p>
        </div>
      )}
      <button onClick={handleStartOver}>Start Over</button>
    </div>
  );
}

export default Results;