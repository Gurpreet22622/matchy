import React from "react";
import {useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './css/Owner.css';

function Owner() {
    const navigate = useNavigate();
    const {user, logout, isAuthenticated } = useAuth0();

    const toHome = async()=>{
        navigate('/');
    }

    if(!isAuthenticated)
    {
      toHome();
    }


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
          <label htmlFor="dropdown2">Choose Option 2:</label>
          <select id="dropdown2" className="form-controlo">
            <option value="optionA">Option A</option>
            <option value="optionB">Option B</option>
            <option value="optionC">Option C</option>
          </select>
        </div>
        <div className="form-groupo">
          <label htmlFor="checkboxes">Select Options:</label>
          <div id="checkboxes">
            <label className="checkbox-labelo">
              <input type="checkbox" value="checkbox1" /> Checkbox 1
            </label>
            <label className="checkbox-labelo">
              <input type="checkbox" value="checkbox2" /> Checkbox 2
            </label>
            <label className="checkbox-labelo">
              <input type="checkbox" value="checkbox3" /> Checkbox 3
            </label>
          </div>
        </div>
        <button type="submit" className="submit-buttono">Submit</button>
      </form>
    </div>
        </>

    );
};

export default Owner;