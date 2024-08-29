import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Owner from './Owner';


function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/owner" element={<Owner />} />
            </Routes>
        </Router>
  );
}

export default App;
