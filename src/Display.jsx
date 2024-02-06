import React, { useEffect } from 'react'
import { useState } from 'react';
import Billing from './AftDisplyPages/Billing';
import Admin from './AftDisplyPages/Admin';
import './Styling/index.css'
import { Button} from "@tremor/react";
import { indexValues } from './FetchingData/Sales';
import { collection,doc, updateDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import { useNavigate } from 'react-router-dom';

const indexCollectionRef = collection(db, 'indexes')
const documentId = 'WH23CKiI1e0rKiGaKz4R';
const indexDocumentRef = doc(indexCollectionRef, documentId);

export default function Display() {

  const [state,setState] = useState(true);
  const [matchFound,setMatchFound] = useState(false)
  const updateDailySales=async()=>{
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    let currentMonth=`${month}-${year}`;
    try{
      const indexDb = await indexValues();
      indexDb.map(async(data)=>{
        if(data.currDate!=currentDate){
          await updateDoc(indexDocumentRef,{
            dailysales:0
          })
        }
        if(data.currMonth!=currentMonth){
          await updateDoc(indexDocumentRef,{
            monthlysales:0
          })
        }
      })
    }
    catch{
      console.error(error);
    }
  }
  useEffect(()=>{
    updateDailySales();
  })
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

