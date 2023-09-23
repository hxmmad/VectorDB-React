import React, { useState, useEffect } from 'react'; //importing react, useState, useEffect
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; //importing react router dom, used to change pages
import Results from './Results';
import './App.css'; 

function App() {
  const [query, setQuery] = useState({ query: '' }); //const is a signal that the variable won’t be reassigned.
  const [isConnected, setIsConnected] = useState(false); //useState is a Hook that lets you add React state to function components.
  const [loading, setLoading] = useState(false); 
  const [opacity, setOpacity] = useState(1); 
  const navigate = useNavigate(); //useNavigate is a hook that returns a navigate function that you can call to programmatically navigate.

  useEffect(() => { //useEffect is a hook that lets you perform side effects in function components
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

  const handleSubmit = async (e) => { //async function is a function that knows how to expect the possibility of the await keyword being used to invoke async code.
    e.preventDefault();
    setLoading(true);
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query) //JSON.stringify method converts a JavaScript object or value to a JSON string
    });

    setLoading(false); 

    if (response.ok) {
      const data = await response.json(); 
      if (data.id) {
        setOpacity(0);
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
    <div className="App flex flex-col items-center pt-32" style={{ '--app-opacity': opacity }}> 
    <p className="bg-gray-300 rounded-full inline-flex p-1 px-3 connectionborder">
        <span className={isConnected ? 'status-icon connected' : 'status-icon not-connected'}></span>
        {isConnected ? 'Connected' : 'Not Connected'}
      </p>
      <h1 className="mb-4 titletext">Optimus Prime</h1>
      <h1 className="mb-4 titletext2">Transformers</h1>
      <h1 className="mb-4 titletext3"> Vector<span className="db-text" style={{color: 'blue'}}>DB</span> Search </h1>
      <form onSubmit={handleSubmit} className="flex2">
        <input type="text" placeholder="autobots, roll out ..." onChange={e => setQuery({ query: e.target.value })} className="mr-2 querybox" />
        <button className="submitbutton text-color:white" type="submit">➞</button>
      </form>
      <h2 className="justify-center powered">Powered By AI</h2>
      {loading && <div className="justify-center flex2 spinner items-center"></div>}
    </div>
  );
}

// Router is a component that wraps your application and keeps the UI and the URL in sync

  function RouterComponent() { //function RouterComponent is a function that returns a router component that can be used to change pages
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

