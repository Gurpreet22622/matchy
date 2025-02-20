import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useNavigate } from 'react-router-dom';
import './css/home.css';
import cityData from './city.json'
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';


const cities = cityData.map(entry => entry.city)


const blueIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// L.Marker.prototype.options.icon = DefaultIcon;

function Home() {
    const [Host, setHost] = useState(false);
    const [Owner, setOwner] = useState(false);
    const [location, setLocation] = useState(null);
    const [nearbyProperty, setNearbyProperty] = useState([]);
    const [route, setRoute] = useState(null);
    const { user,loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const [selectedProperties, setSelectedProperties] = useState([]);
    const navigate = useNavigate();


    const handleCheckboxChange = (propertyItem) => {
        setSelectedProperties((prevSelected) => {
            if (prevSelected.some((item) => item.property.id === propertyItem.property.id)) {
                return prevSelected.filter((item) => item.property.id !== propertyItem.property.id);
            } else {
                return [...prevSelected, propertyItem];
            }
        });
    };

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
          if (data == null) {
            setNearbyProperty([]);
          } else {
            setNearbyProperty(data);
          }
        //   alert("Check console for nearby properties");
          console.log("Nearby Properties:", nearbyProperty)
        } catch (error) {
          console.error("Error fetching properties:", error);
          alert("Failed to fetch properties.");
        }
      };



      const solveTSP = async (start, propertyLocations) => {
        const apiKey = "5b3ce3597851110001cf62484b26d3f736534d2590b3b7e4a45bad34"; // Replace with your OpenRouteService API key
        const locations = [
            [start.longitude, start.latitude], // Start point first
            ...propertyLocations.map((prop) => [
              prop.property.location.longitude,
              prop.property.location.latitude,
            ]),
          ];
        
          const url = "https://api.openrouteservice.org/v2/matrix/driving-car";
        
          try {
            // Step 1: Fetch Distance Matrix from OpenRouteService
            const response = await axios.post(
              url,
              { locations, metrics: ["distance"] },
              { headers: { Authorization: apiKey, "Content-Type": "application/json" } }
            );
        
            const dist = response.data.distances;
            const N = dist.length;
        
            // Step 2: Solve TSP using Held-Karp Dynamic Programming
            const memo = Array.from({ length: N }, () => Array(1 << N).fill(null));
        
            const tsp = (pos, mask) => {
              if (mask === (1 << N) - 1) return dist[pos][0]; // Return to start
              if (memo[pos][mask] !== null) return memo[pos][mask];
        
              let minCost = Infinity;
              for (let nxt = 0; nxt < N; nxt++) {
                if (!(mask & (1 << nxt))) {
                  let newCost = dist[pos][nxt] + tsp(nxt, mask | (1 << nxt));
                  minCost = Math.min(minCost, newCost);
                }
              }
              return (memo[pos][mask] = minCost);
            };
        
            // Step 3: Reconstruct Path
            let mask = 1,
              pos = 0,
              route = [0];
        
            while (mask !== (1 << N) - 1) {
              let nextPos = -1;
              let minCost = Infinity;
              for (let nxt = 0; nxt < N; nxt++) {
                if (!(mask & (1 << nxt))) {
                  let cost = dist[pos][nxt] + tsp(nxt, mask | (1 << nxt));
                  if (cost < minCost) {
                    minCost = cost;
                    nextPos = nxt;
                  }
                }
              }
              if (nextPos === -1) break;
              mask |= 1 << nextPos;
              pos = nextPos;
              route.push(pos);
            }
        
            // Step 4: Format Output in Required Structure
            const orderedRoute = route.slice(1).map((index, i) => ({
              order: i + 1,
              property: propertyLocations[index - 1].property, // Get original property data
              distanceFromPrevious: dist[route[i]][index],
            }));
            setRoute(orderedRoute);
            return orderedRoute;
          } catch (error) {
            console.error("Error fetching distance matrix:", error);
            return [];
          }
        };

        const openGoogleMaps = () => {
            if (!route) return;
        
            const waypoints = route
              .map((place) => `${place.property.location.latitude},${place.property.location.longitude}`)
              .join("|");
        
            const startCoords = `${location.lat},${location.lng}`;
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startCoords}&destination=${startCoords}&waypoints=${waypoints}&travelmode=driving`;
        
            window.open(googleMapsUrl, "_blank");
            setRoute(null);
          };

      const handleClick2 = async () => {
        let startPoint = {latitude: location.lat, longitude: location.lng};
        let propLocations =  selectedProperties.map(item => ({
            property: {
              id: item.property.id,
              location: item.property.location
            }
          }));
          solveTSP(startPoint, propLocations).then(route => console.log("Optimized Route:", route));
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

    <link rel="stylesheet" href="styles.css" />

    <div className="container">
        <div>
        <h1 className="title">Welcome to Our Website</h1>
        <p className="subtitle">Your journey for property deals starts here</p>
        </div>
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
                            <Marker position={[location.lat, location.lng]}
                                    icon={blueIcon}>
                                <Popup>
                                    Your Location
                                </Popup>
                            </Marker>
                            {nearbyProperty.map((propertyItem, index) => (
                <Marker
                    key={index}
                    position={[propertyItem.property.location.latitude, propertyItem.property.location.longitude]}
                    icon={redIcon}
                >
                    <Popup>
                        {propertyItem.property.property_type} - {propertyItem.property.locality}
                    </Popup>
                </Marker>
            ))}
                        </MapContainer><br></br>
                        <button type="button" style={{backgroundColor:'green',borderRadius:'20px'}} onClick={handleClick}>see nearby properties</button>
                    </div>
                    
                )}
            </div>
            {/* {nearbyProperty.length > 0 && (
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
    )} */}
                {nearbyProperty.length >  0 && (
                <div className="property-grid">
                    {nearbyProperty.map((propertyItem, index) => (
                        <div className="property-container" key={index}>
                            <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange(propertyItem)}
                                checked={selectedProperties.some((item) => item.property.id === propertyItem.property.id)}
                            />
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
                    {selectedProperties.length > 0 && (<div>
                <h2>Selected Properties:</h2>
                {selectedProperties.map((item, index) => (
                    <div key={index}>
                        <h3>{item.distance}</h3>
                        
                    </div>
                ))}
                <button type="button" style={{backgroundColor:'white',borderRadius:'20px', fontSize:'1.2rem', padding:'10px', cursor:'pointer'}} onClick={handleClick2}>Get optimised route</button>
                {route && <button style={{backgroundColor:'grey',borderRadius:'20px', fontSize:'1.2rem', padding:'10px', cursor:'pointer'}} onClick={openGoogleMaps}>View Route on Google Maps</button>}
            </div>)}
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
