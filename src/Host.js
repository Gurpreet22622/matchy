import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useNavigate } from 'react-router-dom';
import cityData from './city.json'
import axios from 'axios';


import { SearchWrapper,HostCardWrapper,LoaderWrapper, MapButtonWrapper, FlexContainer, Button2Wrapper, ButtonNavWrapper } from './ui/comp';





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


function Host() {
    const [location, setLocation] = useState({
        lat: 20.5937,
        lng: 78.9629
    });
    const [nearbyProperty, setNearbyProperty] = useState([]);
    const [route, setRoute] = useState(null);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const navigate = useNavigate();
    const [filteredCities, setFilteredCities] = useState(cities);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;


    const handleCheckboxChange = (propertyItem) => {
        setSelectedProperties((prevSelected) => {
            if (prevSelected.some((item) => item.property.id === propertyItem.property.id)) {
                return prevSelected.filter((item) => item.property.id !== propertyItem.property.id);
            } else {
                return [...prevSelected, propertyItem];
            }
        });
    };






    const handleGetLocation = () => {
      setSelectedProperties([]);
      setNearbyProperty([]);
        setLocation({
            lat: 20.5937,
            lng: 78.9629
        });
        setSearchTerm('');
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

    

    useEffect(() => {
        setFilteredCities(
            cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
        setSelectedProperties([]);
        setNearbyProperty([]);
        setLocation({
            lat: 20.5937,
            lng: 78.9629
        });
    };
    
    const handleCitySelect = (city) => {
      setSelectedProperties([]);
      setNearbyProperty([]);
        setLocation({
            lat: 20.5937,
            lng: 78.9629
        });
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

        const ChangeView = ({ center }) => {
            const map = useMap();
            useEffect(() => {
                map.setView(center, 13); // Update the map's view
            }, [center, map]);
            return null;
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
        setLoading(true);
        let startPoint = {latitude: location.lat, longitude: location.lng};
        let propLocations =  selectedProperties.map(item => ({
            property: {
              id: item.property.id,
              location: item.property.location
            }
          }));
          solveTSP(startPoint, propLocations).then(route => console.log("Optimized Route:", route));
          setSelectedProperties([]);
          await new Promise(resolve => setTimeout(resolve, 2000));
          setLoading(false);
      };

        // Sort properties by distance in ascending order
  const sortedProperties = [...nearbyProperty].sort((a, b) => a.distance - b.distance);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProperties.slice(indexOfFirstItem, indexOfLastItem);


    return(
        <>
            <HostCardWrapper>
            <div className="card"> 
                <button className="dismiss" type="button" onClick={()=> navigate('/')}>×</button> 
                <div className="header"> 
        
                <div className="content">
                    <span className="title">Location Details</span> 
                    <p className="message">Please enter you city name or let us find you!</p> 
                </div> 
                <div className="actions">
                    <FlexContainer>
                    <SearchWrapper>
                        <div className="group">
                            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                            <g>
                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                            </g>
                            </svg>
                        <input type="search" 
                        className="input" 
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder="Search city..."/>
                        </div>
                        {isDropdownOpen && (
                                    <div className="dropdown">
                                        <ul>
                                            {filteredCities.length ? (
                                                filteredCities.map((city, index) => (
                                                    <li key={index} onMouseDown={() => handleCitySelect(city)}>
                                                        {city}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No cities found</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                    </SearchWrapper>  
                    <MapButtonWrapper>
                    <button className="faq-button" onClick={handleGetLocation}>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    width="655.359"
                    height="655.359"
                    viewBox="0 0 6.827 6.827"
                    style={{
                        shapeRendering: "geometricPrecision",
                        textRendering: "geometricPrecision",
                        imageRendering: "optimizeQuality",
                        fillRule: "evenodd",
                        clipRule: "evenodd",
                    }}
                    >
                    <defs>
                        <style>{".fil2{fill:none}"}</style>
                    </defs>
                    <g id="Layer_x0020_1">
                        <path
                        style={{ fill: "#00897b", fillRule: "nonzero" }}
                        d="M3.413 3.764H5.07l.024.084.581 1.976.044.15H3.414z"
                        />
                        <path
                        style={{ fill: "#26a69a", fillRule: "nonzero" }}
                        d="M1.844 3.764h1.569v2.21H1.107l.626-2.126.024-.084z"
                        />
                        <g id="_490154376">
                        <path id="_490154424" className="fil2" d="M0 0h6.827v6.827H0z" />
                        <path
                            id="_490154760"
                            className="fil2"
                            d="M.853.853h5.12v5.12H.853z"
                        />
                        </g>
                        <path
                        d="M4.808 2.357c0 .612-.587 1.418-1.027 2.021-.102.14-.196.27-.272.381l-.096.142-.096-.142c-.075-.112-.168-.24-.27-.381-.438-.607-1.029-1.424-1.029-2.03 0-.411.156-.781.405-1.05.254-.273.606-.44.99-.44.385 0 .736.169.99.443.25.27.405.643.405 1.056z"
                        style={{ fill: "#ffcc80" }}
                        />
                        <path
                        d="M3.413 2.872a.666.666 0 0 1-.665-.658.666.666 0 0 1 1.33 0 .666.666 0 0 1-.665.658z"
                        style={{ fill: "#ffa726" }}
                        />
                    </g>
                    </svg>
                    <span className="tooltip">my location</span>
                    </button>
                    </MapButtonWrapper>
                    </FlexContainer>

                </div> 
                </div> 
            </div>
            </HostCardWrapper><br></br><br></br>


            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="map-container">
                                    <MapContainer center={[location.lat, location.lng]} zoom={1} scrollWheelZoom={false} style={{ height: "500px", width: "500px" }}>
                                    <ChangeView center={[location.lat, location.lng]} />
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
                                    </MapContainer>
            </div>
                    
            
                        <div>
            <Button2Wrapper>
      <button className="animated-button" onClick={handleClick}>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="text">N E A R B Y -  L O C A T I O N S</span>
        <span className="circle" />
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>
    </Button2Wrapper>

      {selectedProperties.length >0 && (
        <button type="button" 
        style={{backgroundColor:'white',borderRadius:'20px', fontSize:'1.2rem', padding:'10px',marginLeft:'50px',marginTop:'10px', cursor:'pointer'}} 
        onClick={handleClick2}>Get optimised route</button>
      )}<br></br>
      {loading && (
        <LoaderWrapper>
        <div className="hourglassBackground">
          <div className="hourglassContainer">
            <div className="hourglassCurves" />
            <div className="hourglassCapTop" />
            <div className="hourglassGlassTop" />
            <div className="hourglassSand" />
            <div className="hourglassSandStream" />
            <div className="hourglassCapBottom" />
            <div className="hourglassGlass" />
          </div>
        </div>
      </LoaderWrapper>
      )}
       
      {(route && (loading !== true)) &&  <button 
      style={{backgroundColor:'grey',borderRadius:'20px', fontSize:'1.2rem',marginLeft:'20px',marginTop:'10px', padding:'10px', cursor:'pointer'}} 
      onClick={openGoogleMaps}>View Route on Google Maps</button>}
      
      </div>



    {nearbyProperty.length >  0 && (
            <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            <div
              className="table-responsive p-3 rounded shadow-lg"
              style={{
                width: "800px",
                height: "400px",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.5)",
                overflowY: "auto",
              }}
            >
              <table className="table table-bordered text-center">
                <thead style={{ color: "grey", fontWeight: "bold" }}>
                  <tr>
                    <th>Select</th>
                    <th>Property Type</th>
                    <th>Locality</th>
                    <th>Furnished Status</th>
                    <th>Property Area (sq ft)</th>
                    <th>Lease Type</th>
                    <th>Amenities</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((propertyItem, index) => {
                    const { property } = propertyItem;
                    const amenities = [
                      property.internet && "Internet",
                      property.ac && "AC",
                      property.ro && "RO",
                      property.kitchen && "Kitchen",
                      property.geezer && "Geezer",
                    ].filter(Boolean).join(", ");
      
                    const isChecked = selectedProperties.some(
                      (item) => item.property.id === propertyItem.property.id
                    );
      
                    return (
                      <tr
                        key={index}
                        style={{ color: "green", height: "50px", cursor: "pointer" }}
                        onClick={() => handleCheckboxChange(propertyItem)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              e.stopPropagation(); // Prevents row click from triggering twice
                              handleCheckboxChange(propertyItem);
                            }}
                            checked={isChecked}
                          />
                        </td>
                        <td>{property.property_type}</td>
                        <td>{property.locality}</td>
                        <td>{property.furnished_status}</td>
                        <td>{property.property_area}</td>
                        <td>{property.lease_type}</td>
                        <td>{amenities || "None"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
      
            {/* Pagination Controls */}
            <div>
            <ButtonNavWrapper>
      <button className="btn-shine mx-2"  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>Previous</button>
              <span style={{color:'black'}}>Page {currentPage} of {Math.ceil(nearbyProperty.length / itemsPerPage)}</span>
      <button className="btn-shine"  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(nearbyProperty.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(nearbyProperty.length / itemsPerPage)}>Next</button>
    </ButtonNavWrapper>

            </div>
          </div>
          
                            
                            )}

            </div>
        </>
    );
}

export default Host;