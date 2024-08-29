import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useNavigate } from 'react-router-dom';
import './css/home.css';
import cityData from './city.json'
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const cities = cityData.map(entry => entry.city)


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

function Home() {
    const [Host, setHost] = useState(false);
    const [Owner, setOwner] = useState(false);
    const [location, setLocation] = useState(null);
    const { user,getIdTokenClaims ,loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        // event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/login', {
                email:user.email,
                name: user.name,
                picture: user.picture
            }, {
                headers: 
                {
                    'Content-Type': 'application/json'
                }
            });

            // if (typeof response.data.id==='string') {
            //     setShowModal2(true);
                
            // }else{
            //   setShowModal(true);
            // }
        } catch (error) {
            console.error('Login failed', error);
        }
    };


    if(isAuthenticated){
        // console.log(user,getIdTokenClaims().then((idToken)=>{console.log("here-",idToken)}));
        // handleSubmit();
        navigate('/owner');
        handleSubmit();
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

    const [filteredCities, setFilteredCities] = useState(cities);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setFilteredCities(
            cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
        setLocation(null);
    };
    
    const handleCitySelect = (city) => {
        setLocation(null);
        setSearchTerm(city);
        setLocation({
            lat: cityData.find(entry => entry.city === city).latitude,
            lng: cityData.find(entry => entry.city === city).longitude
        });

        setIsDropdownOpen(false);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.dropdown')) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        // <>
        //     <meta charSet="UTF-8" />
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        //     <title>Beautiful Landing Page</title>
        //     <link rel="stylesheet" href="styles.css" />
        //     <div className="container">
        //         <h1 className="title">Welcome to Our Website</h1>
        //         <p className="subtitle">Your journey for property deals starts here</p>
        //         <div className="button-container">
        //             <a href="#" className="button primary" onClick={() => { setHost(true); setOwner(false); setLocation(null)}}>
        //                 Host
        //             </a>
        //             <a href="#" className="button secondary" onClick={() => { setHost(false); setOwner(true); setLocation(null)}}>
        //                 Owner
        //             </a>
        //         </div>

        //         {Host && (
        //             <div className="form-container">
        //                 <h2>Host Form</h2>
        //                 <form>
        //                     <div className="dropdown-container">
        //     <label htmlFor="search">Select City:</label>
        //     <div className="dropdown">
        //         <input
        //             type="text"
        //             id="search"
        //             value={searchTerm}
        //             onChange={handleInputChange}
        //             placeholder="Search city..."
        //         />
        //         {isDropdownOpen && (
        //             <div className="dropdown-menu">
        //                 <ul>
        //                     {filteredCities.length ? (
        //                         filteredCities.map((city, index) => (
        //                             <li key={index} onClick={() => handleCitySelect(city)}>
        //                                 {city}
        //                             </li>
        //                         ))
        //                     ) : (
        //                         <li>No cities found</li>
        //                     )}
        //                 </ul>
        //             </div>
        //         )}
        //     </div>
        // </div>
        // or<br></br><br></br>
        //                     <button type="button" onClick={handleGetLocation}>Get Current Location</button>
        //                 </form>

        //                 {location && (
        //                     <div className="map-container">
        //                         <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
        //                             <TileLayer
        //                                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //                                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        //                             />
        //                             <Marker position={[location.lat, location.lng]}>
        //                                 <Popup>
        //                                     Your Location
        //                                 </Popup>
        //                             </Marker>
        //                         </MapContainer>
        //                     </div>
        //                 )}
        //             </div>
        //         )}

        //         {Owner && (
        //             <div className="form-container">
        //                 <h2>Owner Form</h2>
        //                 <form>
        //                     <label>
        //                         Owner Name:
        //                         <input type="text" name="ownerName" />
        //                     </label>
        //                     <label>
        //                         Contact Information:
        //                         <input type="text" name="contactInfo" />
        //                     </label>
        //                     <button type="submit">Submit</button>
        //                 </form>
        //             </div>
        //         )}
        //     </div>
        // </>

        <>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Beautiful Landing Page</title>
    <link rel="stylesheet" href="styles.css" />
    <div className="container">
        <h1 className="title">Welcome to Our Website</h1>
        <p className="subtitle">Your journey for property deals starts here</p>
        <div className="button-container">
            <a className="button primary" onClick={() => { setHost(true); setOwner(false); setLocation(null)}}>
                Host
            </a>
            <a className="button secondary" onClick={() => { setHost(false); setOwner(true); setLocation(null)}}>
                Owner
            </a>
        </div>

        {Host && (
            <div className="form-container">
                <h2>Host Form</h2>
                <form>
                    <div className="form-row">
                        <label htmlFor="search">Select_City:</label>
                        <div className="dropdown">
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={handleInputChange}
                                placeholder="Search city..."
                            />
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <ul>
                                        {filteredCities.length ? (
                                            filteredCities.map((city, index) => (
                                                <li key={index} onClick={() => handleCitySelect(city)}>
                                                    {city}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No cities found</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div><p className="or">or</p>
                        <button type="button" onClick={handleGetLocation}>Find_Me</button>
                    </div>
                </form>

                {location && (
                    <div className="map-container">
                        <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
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
        )}

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
