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
    const [nearbyProperty, setNearbyProperty] = useState([]);
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




    // if(isAuthenticated){
    //     // console.log(user,getIdTokenClaims().then((idToken)=>{console.log("here-",idToken)}));
    //     // handleSubmit();
    //     axios.post('http://localhost:8080/login', {
    //     email: user.email,
    //     username: user.nickname,
    //     full_name: user.name,
    //     user_role: "owner",
    //     picture: user.picture
    //     })
    //     .then(response => {
    //     console.log("User registered in backend:", response.data);
    //     // Redirect to another page after successful registration
    //     //window.location.href = '/owner';
    //     //navigate("/owner")
    //     })
    //     .catch(error => {
    //     console.error("Error registering user:", error);
    //     });


    //     navigate('/owner');
    // }


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

    const handleClick = async () => {
        const url = `http://localhost:8080/nearbyProps?lat=${location.lat}&lng=${location.lng}`;
    
        try {
          const response = await fetch(url, { method: "GET" });
          const data = await response.json();  
          setNearbyProperty(data);
          alert("Check console for nearby properties");
          console.log("Nearby Properties:", nearbyProperty)
        } catch (error) {
          console.error("Error fetching properties:", error);
          alert("Failed to fetch properties.");
        }
      };

    // useEffect(() => {
    //     if (isAuthenticated) {
    //       // Sending user data to the backend after login
    //       axios.post('http://localhost:8080/login', {
    //         email: user.email,
    //         username: user.nickname,
    //         name: user.name,
    //         role: "owner",
    //         picture: user.picture
    //       })
    //       .then(response => {
    //         console.log("User registered in backend:", response.data);
    //         // Redirect to another page after successful registration
    //         //window.location.href = '/owner';
    //         navigate("/owner")
    //       })
    //       .catch(error => {
    //         console.error("Error registering user:", error);
    //       });
    //     }
    //   }, [isAuthenticated, user]);


    return (
        <>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Beautiful Landing Page</title>
    <link rel="stylesheet" href="styles.css" />
    <div className="container">
        <h1 className="title">Welcome to Our Website</h1>
        <p className="subtitle">Your journey for property deals starts here</p>
        <div className="button-container">
            <button className="button primary" onClick={() => { setHost(true); setOwner(false); setLocation(null)}}>
                Host
            </button>
            <button className="button secondary" onClick={() => { setHost(false); setOwner(true); setLocation(null)}}>
                Owner
            </button>
        </div>

        {Host && (
            <div className="property-wrapper">
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
                        </MapContainer><br></br>
                        <button type="button" style={{backgroundColor:'green',borderRadius:'20px'}} onClick={handleClick}>see nearby properties</button>
                    </div>
                    
                )}
            </div>
            {/* <div className="property-container">
                <h3>{nearbyProperty[0].property.property_type}</h3>
                <p>{nearbyProperty[0].property.locality}<br></br>
                    {nearbyProperty[0].property.furnished_status}<br></br>
                    {nearbyProperty[0].property.property_area} sq ft<br></br>
                    lease type: {nearbyProperty[0].property.lease_type}<br></br>
                    amanities: 
                    {nearbyProperty[0].property.internet && (<text>internet</text>)}
                    {nearbyProperty[0].property.ac && (<text> ac</text>)}
                    {nearbyProperty[0].property.ro && (<text> ro</text>)}
                    {nearbyProperty[0].property.kitchen && (<text> kitchen</text>)}
                    {nearbyProperty[0].property.geezer && (<text> geezer</text>)}

                </p>

                
            </div> */}
            {nearbyProperty.length > 0 && (
        <div className="property-grid">
            {nearbyProperty.map((propertyItem, index) => (
                <div className="property-container" key={index}>
                    <h3>{propertyItem.property.property_type}</h3>
                    <p>
                        {propertyItem.property.locality}<br />
                        {propertyItem.property.furnished_status}<br />
                        {propertyItem.property.property_area} sq ft<br />
                        Lease type: {propertyItem.property.lease_type}<br />
                        Amenities: 
                        {propertyItem.property.internet && <span> Internet</span>}
                        {propertyItem.property.ac && <span> AC</span>}
                        {propertyItem.property.ro && <span> RO</span>}
                        {propertyItem.property.kitchen && <span> Kitchen</span>}
                        {propertyItem.property.geezer && <span> Geezer</span>}
                    </p>
                </div>
            ))}
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
