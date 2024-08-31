import React, { useState} from "react";
import {useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth0 } from '@auth0/auth0-react';
import './css/Owner.css';
import axios from 'axios';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function Owner() {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const {user, logout, isAuthenticated } = useAuth0();
    const [file, setFile] = useState()
    const [error, setError] = useState('');

    function handleChange(event) {
      const selectedFile = event.target.files[0];
  
      if (selectedFile) {
        const video = document.createElement('video');
        video.preload = 'metadata';
  
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
  
          if (duration > 300) { // 300 seconds = 5 minutes
            setError('The video is too long. Please select a video that is less than 5 minutes.');
            event.target.value = null; // Clear the selected file
          } else {
            setError('');
            setFile(selectedFile); // Set the file if it passes the duration check
          }
        };
  
        video.src = URL.createObjectURL(selectedFile);
      }
    }
    
    function handleSubmit(event) {
      event.preventDefault();
      if (!file) {
        setError('Please select a valid video file.');
        return;
      }
  
      const url = 'http://localhost:3000/uploadFile';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      axios.post(url, formData, config).then((response) => {
        console.log(response.data);
      });
    }
  

    const toHome = async()=>{
        navigate('/');
    }

    if(!isAuthenticated)
    {
      toHome();
    }

    const handleGetLocation = () => {
      setLocation(null);
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
              setLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              });
          });
      } else {
          alert("Geolocation is not supported by this browser.");
      }
  };


    return(
    //     <>
    //         <div>
    //             <p>
    //                 welcome owner!
    //             </p>
    //             {!isAuthenticated ? (
    //     {toHome}
    //   ) : (
    //     <button onClick={() => logout({ returnTo: window.location.origin })}>
    //       Log Out
    //     </button>
    //   )}
    //         </div>
    //     </>
        <>
            <div className="form-containero">
      {/* <button className="logout-button">Logout</button> */}
      {!isAuthenticated ? (
        ()=>{navigate('/')}
      ) : (
        <button className="logout-buttono" onClick={() => {logout({ returnTo: window.location.origin }); navigate('/')}}>
          Log Out
        </button>
      )} 
      <h2 className="form-titleo">King of the House</h2>
      <h2 className="form-titleo">hello {user.name}</h2>
      <form className="preferences-formo">
        <div className="form-groupo">
          <label htmlFor="dropdown1">What you want to rent:</label>
          <select id="dropdown1" className="form-controlo">
            <option value="option1">Complete House</option>
            <option value="option2">Floor</option>
            <option value="option3">Seperate Rooms</option>
          </select>
        </div>
        
        <div className="form-groupo">
        <button type="button" onClick={handleGetLocation}>Find_Me</button>

        {location && (
                    <div className="map-container">
                        <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "100px", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[location.lat, location.lng]}>
                                <Popup>
                                    Your Location
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                )}
          
        </div>
        <div className="form-groupo">
            <label id="address">Enter your complete address:</label>
            <input type="text" />
          </div>

          <div className="form-groupo">
            <h3>Upload a video file of your room!</h3>
            <input type="file" accept="video/*" onChange={handleChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>

          <button type="submit" className="submit-buttono">Submit</button>
        </form>
    </div>
        </>

    );
};

export default Owner;