import React from 'react'
import { useState } from 'react';
import Billing from './AftDisplyPages/Billing';
import Admin from './AftDisplyPages/Admin';
import './Styling/index.css'
import { Button } from "@tremor/react";


export default function Display() {

  const [state,setState] = useState(true);
  const[billState,setBillState] = useState(false);
  const [matchFound,setMatchFound] = useState(false)
  const [empId,setEmpId]=useState('');

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
  
    <div className="body">
             <Button size="lg" onClick={newBill}> + New Bill</Button>
    </div>
      <Button size="xs" className='adminlogin' onClick={ownerLogin}>Admin</Button>
    </>
  )}
  else if(state===false && billState==false){
      return(
       <>
          <input type="text" placeholder='service id' onChange={(e)=>setEmpId(e.target.value)}/>
          <button onClick={idSubmit}>submit</button>
          <Billing />

       </>
      )
  }
  else if(state===false && billState==true){
    return(
          <>
          <Billing empId={empId}/>
          </>
    )
  }
}


