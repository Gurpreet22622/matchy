import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import {useNavigate } from 'react-router-dom';
import './css/home.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import {ButtonWrapper} from './ui/comp.js'


function Home() {
    const [Owner, setOwner] = useState(false);
    const { user,loginWithRedirect, logout, isAuthenticated } = useAuth0();

    const navigate = useNavigate();



    useEffect(() => {
        if (isAuthenticated) {
            axios.post('http://localhost:8080/login', {
                email: user.email,
                username: user.nickname,
                full_name: user.name,
                user_role: "owner",
                picture: user.picture
            })
            .then(response => {
                console.log("User registered in backend:", response.data);
                navigate('/owner');
            })
            .catch(error => {
                console.error("Error registering user:", error);
            });
            navigate('/owner');
        }
    }, [isAuthenticated, user, navigate]);

    
        return (
        <>

    <div className="container">
        <div>
        <h1 className="title">Welcome to Our Website</h1>
        <p className="subtitle">Your journey for property deals starts here</p>
        </div>
        <ButtonWrapper>
      <div className="container">
        <button className="button type--C" onClick={() => navigate('/host')}>
          <div className="button__line" />
          <div className="button__line" />
          <span className="button__text">Host</span>
          <div className="button__drow1" />
          <div className="button__drow2" />
        </button>
        <button className="button type--C" onClick={() => { setOwner(true)}}>
          <div className="button__line" />
          <div className="button__line" />
          <span className="button__text">Owner</span>
          <div className="button__drow1" />
          <div className="button__drow2" />
        </button>
      </div>
    </ButtonWrapper>


        {Owner && (
            <div className="form-container">
                <h2>Owner Form</h2>
                <form>
                    
                <div>
      {!isAuthenticated ? (
        <button onClick={() => {loginWithRedirect()}}>Register your property</button>
      ) : (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      )}
    </div>
                </form>
            </div>  
        )}
    
    </div>
</>

    );
}

export default Home;
