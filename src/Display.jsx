import React from 'react'
import { useState } from 'react';
import Billing from './AftDisplyPages/Billing';
import Admin from './AftDisplyPages/Admin';
import './Styling/index.css'
import { Button} from "@tremor/react";
import { useNavigate } from 'react-router-dom';


export default function Display() {

  const [state,setState] = useState(true);
  const [matchFound,setMatchFound] = useState(false)
  const navigate = useNavigate();


  const newBill = ()=>{
    console.log('hii')
    setState(false);
  }
  const ownerLogin=async()=>{
    setMatchFound(true);
  }

  if(matchFound){
    return(
     navigate('/display/admin')
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
    
  else{ 
    return( 
      navigate('/display/billing')
    );
  }
}

