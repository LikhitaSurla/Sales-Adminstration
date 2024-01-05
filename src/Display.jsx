import React from 'react'
import { useState } from 'react';
import Billing from './Billing';
export default function Display() {
  const [state,setState] = useState(true);
  const[billState,setBillState] = useState(false);


  const newBill = ()=>{
    setState(false);
  }
  const idSubmit =()=>{
    setBillState(true);
  }
  const ownerLogin=()=>{
    
  }


  if(state){
  return (
    <div>
      <button onClick={newBill}>New Bill</button> 
      <button onClick={ownerLogin}>owner login</button>
    </div>
  )}
  else if(state===false&&billState==false){
      return(
       <>
          <input type="text" placeholder='service id'/>
          <button onClick={idSubmit}>submit</button>
          <Billing/>
       </>
      )
  }
  else if(state===false&&billState==true){
    return(
          <>
          <Billing/>
          </>
    )
  }
}
