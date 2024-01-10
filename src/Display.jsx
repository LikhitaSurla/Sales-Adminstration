import React from 'react'
import { useState } from 'react';
import Billing from './AftDisplyPages/Billing';
import Admin from './AftDisplyPages/Admin';
export default function Display() {

  const [state,setState] = useState(true);
  const[billState,setBillState] = useState(false);
  const [matchFound,setMatchFound] = useState(false)

  const newBill = ()=>{
    setState(false);
  }
  const idSubmit =()=>{
    setBillState(true);
  }

  const ownerLogin=async()=>{
    setMatchFound(true);
  }

  if(matchFound){
    return(
      <>
      <Admin/>
      </>
    )
  }
  else if(state){
    return (
    <>
    <div>
      <button onClick={newBill}>New Bill</button> 
      <button onClick={ownerLogin}>owner login</button>
    </div>
    </>
  )}
  else if(state===false && billState==false){
      return(
       <>
          <input type="text" placeholder='service id'/>
          <button onClick={idSubmit}>submit</button>
          <Billing/>
       </>
      )
  }
  else if(state===false && billState==true){
    return(
          <>
          <Billing/>
          </>
    )
  }
}


