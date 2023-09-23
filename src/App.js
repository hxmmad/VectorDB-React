import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Results from './Results';
import './App.css'; 

function App() {
  const [query, setQuery] = useState({ query: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the FastAPI is connected when the component is mounted
    fetch('http://localhost:8000/search')
      .then(response => {
        if (response.ok) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      })
      .catch(() => setIsConnected(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Add this line
    // Send the input text to the FastAPI
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    });

    setLoading(false); // Add this line

    if (response.ok) {
      const data = await response.json();
      if (data.id) {
        navigate('/results', { state: { query: data.query } });
        console.log('Query Pushed Successfully.');
      } else {
        console.log('Query has not been pushed.');
      }
    } else {
      console.log('Query has not been pushed.');
    }
  }

  return (
    <div className="App flex flex-col items-center pt-32">
      <p className="bg-gray-300 rounded-full inline-flex p-1 px-3">
        <span className={isConnected ? 'status-icon connected' : 'status-icon not-connected'}></span>
        {isConnected ? 'Connected' : 'Not Connected'}
      </p>
      <h1 className="mb-4 titletext">Optimus Prime Transformers</h1>
      <h1 className="mb-4 titletext2">Vector<span style={{color: 'blue'}}>DB</span> Search</h1>
      <form onSubmit={handleSubmit} className="flex2">
        <input type="text" placeholder="Enter text here" onChange={e => setQuery({ query: e.target.value })} className="mr-2 querybox" />
        <button className="submitbutton" type="submit">Submit</button>
      </form>
      <h2 className="justify-center powered">Powered By AI</h2>
      {loading && <div className="justify-center flex2 spinner items-center"></div>} {/* Add this line */}
    </div>
  );
}

function RouterComponent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default RouterComponent;