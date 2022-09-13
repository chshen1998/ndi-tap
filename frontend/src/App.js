import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {useState, useEffect} from 'react';
import Main from "./components/Main"
import Header from './components/Header'
import Login from './components/Login'

const App = () => {
  
  return (
    <div className="background">
      <div className="container">
          <Header/>
          <Router>
            <Routes>
              <Route exact path="/" element={<Login/>} />
              <Route path="/callback" element={<Main/>}/>
            </Routes>
          </Router>
      </div>
    </div>

  );
}

export default App;
