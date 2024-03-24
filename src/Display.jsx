import React, { useEffect, useState } from 'react';
import { Button } from "@tremor/react";
import { indexValues } from './FetchingData/Sales';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import { useNavigate } from 'react-router-dom';
import 'ldrs/bouncy'

const indexCollectionRef = collection(db, 'indexes');
const documentId = 'WH23CKiI1e0rKiGaKz4R';
const indexDocumentRef = doc(indexCollectionRef, documentId);

const Display = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(true);
  const [matchFound, setMatchFound] = useState(false);
  const [hasSessionData, setHasSessionData] = useState(false);
  const[loading,setLoading] = useState(true);

  const updateDailySales = async () => {
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
            dailysales:0,
            newcustomers:0
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
  };

  useEffect(() => {
    const checkSessionData = async () => {
      const dataInSession = sessionStorage.getItem('User');
      if (!dataInSession) {
        navigate('/');
      } else {
        setHasSessionData(true);
      }
    };
    checkSessionData();
  }, []);

  useEffect(() => {
    if (hasSessionData) {
      updateDailySales();
    }
  }, [hasSessionData]);

  const newBill = () => {
    setState(false);
  };

  const ownerLogin = async () => {
    setMatchFound(true);
  };
   setTimeout(()=>{
    setLoading(false)
   },1200)
   if(loading &&hasSessionData){
    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <l-bouncy
        size="45"
        speed="1.75"
        color="#0A1052" 
      ></l-bouncy>
    </div>
    )
   }
  else if (matchFound) {
    return navigate('/display/admin');
  } 
  else if (state && hasSessionData) {
    return (
      <>
          <div className="displaybg">
          <Button size="lg" onClick={newBill}>
            + New Bill
          </Button>
        </div>
        <Button size="xs" className='adminlogin' onClick={ownerLogin}>
          Admin
        </Button>
        
      </>
    );
  } else {
    return navigate('/display/billing');
  }
};

export default Display;