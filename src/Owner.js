import React, { useEffect,useState} from "react";
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

const CACHE_KEY = "auth0_user_data";
const CACHE_DURATION = 60 * 60 * 1000;

function Owner() {
    const navigate = useNavigate();
    const [propertyType, setPropertyType] = useState('BHK1');
    const [location, setLocation] = useState(null);
    const [locality, setLocality] = useState(null);
    const [propertyarea, setPropertyarea] = useState(null);
    const [lease_type, setLeaseType] = useState('Family');
    const [furnished_status, setFurnishedStatus] = useState('Not Furnished');
    const [internet, setInternet] = useState(false);
    const [AC, setAC] = useState(false);
    const [RO, setRO] = useState(false);
    const [geezer, setGeezer] = useState(false);
    const [kitchen, setKitchen] = useState(false);
    const {user, getIdTokenClaims, logout, isAuthenticated } = useAuth0();
    const [cachedUser, setCachedUser] = useState(null);

    const [error,  setError] = useState('');
    const [owner, setOwner] = useState(null);
    const [rent, setRent] = useState(0);

    const getCachedData = () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data; 
        }
      }
      return null;
    }
    useEffect(() => {
      if (user) {
        // Store user in cache when available
        const cachedData = { user, isAuthenticated, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
        setCachedUser(user);
      } else {
        // If user is null, check cache
        const cachedUser = getCachedData();
        if (cachedUser) {
          setCachedUser(cachedUser);
        }
      }
      const interval = setInterval(() => {
        if (user) {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ user, isAuthenticated, timestamp: Date.now() })
          );
        }
      }, CACHE_DURATION);
  
      return () => clearInterval(interval);
    }, [user, isAuthenticated]);

    useEffect(() => {
      axios.get("http://localhost:8080/user", {
          params: { email: cachedUser?.email }, 
        })
        .then((response) => setOwner(response.data))
        .catch((error) => console.error("Error fetching data:", error));
    }, [cachedUser?.email]);


    console.log("owner is here->",owner, user)
    getIdTokenClaims().then((idToken)=>{console.log("here-",idToken)})
    console.log("check items-> \npropertyType",propertyType,"\nlocation",location,"\nlocality",locality,"\npropertyarea",propertyarea,"\nleasetype",lease_type,"\nfurnishedStatus",furnished_status,"\ninternet",internet,"\nac",AC,"\nro",RO,"\ngeezer",geezer,"\nkitchen",kitchen)


    
    function handleSubmit(event) {
      event.preventDefault();
      if(!location){
        setError('Please add your location.');
        return;
      }else if(!locality){
        setError('Please add your locality.');
        return;
      }else if(!propertyarea){
        setError('Please add the area of your property.')
      }else if(!rent){
        setError('Please add your rent or predict it.')
      }else{
      setError(null)
      }

      axios.post('http://localhost:8080/registerNP', {
        user_id: owner.id,
        property_type: propertyType,
        location: {latitude:location.lat, longitude:location.lng},
        locality: locality,
        lease_type: lease_type,
        furnished_status: furnished_status,
        property_area: parseFloat(propertyarea),
        internet:internet,
        ac:AC,
        ro:RO,
        kitchen:kitchen,
        geezer:geezer,
        rent: rent
    })
    .then(response => {
        console.log("Property is registered registered in backend:", response.data);
        logout({ returnTo: window.location.origin });
        toHome();
    })
    .catch(error => {
        console.error("Error registering property:", error);
    });

}
    

function predictRent(event) {
  event.preventDefault();
  if(!location){
    setError('Please add your location.');
    return;
  }else if(!locality){
    setError('Please add your locality.');
    return;
  }else if(!propertyarea){
    setError('Please add the area of your property.')
  }else{
  setError(null)
  }

  axios.post('http://localhost:8080/predictR', {
    user_id: owner.id,
    property_type: propertyType,
    location: {latitude:location.lat, longitude:location.lng},
    locality: locality,
    lease_type: lease_type,
    furnished_status: furnished_status,
    property_area: parseFloat(propertyarea),
    internet:internet,
    ac:AC,
    ro:RO,
    kitchen:kitchen,
    geezer:geezer
    }
)
.then(response => {
    console.log("Rent is predicted:", response.data);
    setRent(response.data / 10)
})
.catch(error => {
    console.error("Error predicting rent:", error);
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
        <>
            <div className="form-containero">
      {!isAuthenticated ? (
        ()=>{navigate('/')}
      ) : (
        <button className="logout-buttono" onClick={() => {logout({ returnTo: window.location.origin }); navigate('/')}}>
          Log Out
        </button>
      )} 
      <h2 className="form-titleo">King of the House</h2>
      <h2 className="form-titleo">hello {cachedUser?.name}</h2>
      <form className="preferences-formo">
        <div className="form-groupo">
          <label htmlFor="dropdown1">What is your property type:</label>
          <select id="dropdown1" className="form-controlo" onChange={e => setPropertyType(e.target.value)}>
            <option value="BHK1">1 BHK</option>
            <option value="BHK2">2 BHK</option>
            <option value="BHK3">3 BHK</option>
            <option value="BHK4">4 BHK</option>
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
            <label id="locality">Enter your Locaclity:</label>
            <input type="text" onChange={e => setLocality(e.target.value)}/>
          </div>

          <div className="form-groupo">
          <label htmlFor="dropdown2">What is your lease type:</label>
          <select id="dropdown2" className="form-controlo" onChange={e => setLeaseType(e.target.value)}>
            <option value="Family">Family</option>
            <option value="Bachlors">Bachlors</option>
            <option value="Anyone">Anyone</option>
          </select>
        </div>
        <div className="form-groupo">
          <label htmlFor="dropdown3">Furnished status:</label>
          <select id="dropdown3" className="form-controlo" onChange={e => setFurnishedStatus(e.target.value)}>
            <option value="Not Furnished">Not Furnished</option>
            <option value="Semi Furnished">Semi Furnished</option>
            <option value="Fully Furnished">Fully Furnished</option>
          </select>
        </div>
        <div className="form-groupoo">
            <label id="area">Property area(sq ft):</label>
            <input type="number" step="0.1" onChange={e => setPropertyarea(e.target.value)}/>
          </div><br></br>
          <text>Amanities:</text><br></br>
          <div className="form-groupo">
          <input type="checkbox" onChange={e => setInternet(e.target.checked)}/>
          <text>Internet</text><br></br>
          <input type="checkbox" onChange={e => setAC(e.target.checked)}/>
          <text>AC</text><br></br>
          <input type="checkbox" onChange={e => setRO(e.target.checked)}/>
          <text>RO</text><br></br>
          <input type="checkbox" onChange={e => setKitchen(e.target.checked)}/>
          <text>Kitchen</text><br></br>
          <input type="checkbox" onChange={e => setGeezer(e.target.checked)}/>
          <text>Geezer</text><br></br>
          </div>


          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="form-groupo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="rent">Enter rent:</label>
            <input
              id="rent"
              type="text"
              value={rent}
              onChange={e => setRent(e.target.value)}
              style={{ flex: '1' }}
            />
            <button type="button" onClick={predictRent}>
              Predict rent
            </button>
          </div>


          <button onClick={handleSubmit} className="submit-buttono">Submit</button>
        </form>
    </div>
  
        </>

    );
};

export default Owner;