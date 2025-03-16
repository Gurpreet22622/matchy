import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Owner from './Owner';
import Host from './Host';


function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/owner" element={<Owner />} />
                <Route path="/host" element={<Host />} />
            </Routes>
        </Router>
  );
}

export default App;
