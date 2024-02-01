import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import fetchData from '../FetchingData/Data';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Metric } from "@tremor/react";
import '../Styling/index.css';
import { collection, getDoc, getDocs,doc, query,updateDoc,where } from 'firebase/firestore';

export default function Admin(props) {
  const [state, setState] = useState(false);
  const [passState, setPassState] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const userCollectionRef = collection(db,'userdata');
  const [userId,setUserId] = useState('');
  const [tempPassword,setTempPassword] = useState('');
  const navigate = useNavigate();

  const updatePasswordBtn = () => {
    setPassState(true);
  }

  const ownerClicked = async (e) => {
    e.preventDefault();
    let matchfound = false;
    try {
      const usersData = await fetchData();
      usersData.forEach((doc) => {
        if (doc.name === ownerName && doc.password === ownerPassword) {
          matchfound = true;
        }
      });
      if (matchfound) {
        setState(true);
      }
    } catch (err) {
      console.error(err);
    }
  }
  const formSubmitted = async(e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    try {
      const querySnapshot = query(collection(db, 'userdata'), where('id', '==', userId));
      const q = getDocs(querySnapshot);
      console.log(q)
      q.forEach(async(doc)=>{
        if(doc.data().id==userId){
          await updateDoc(doc,{
            id:15,
            password:"iuahsdhak"
          })
        }
      })
      // const userDocs = await fetchData();
      // userDocs.forEach(async (userDoc) => {
      //   if (userDoc.id === 2) {
      //     console.log(userDoc.id,userDoc.name,userDoc.password)
      //     const userDocRef = doc(userCollectionRef,userDoc.id);
      //     await updateDoc(userDocRef, {
      //       id: 10,
      //       password: 'hello',
      //     });
      //   }
      // });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  if (passState) {
    return (
      <form onSubmit={formSubmitted}>
        <label htmlFor="userId">User Id:</label>
        <input type="text" name="userId" id="userId" onChange={(e)=>{setUserId(e.target.value)}} />

        <label htmlFor="tempPassword">Temporary Password:</label>
        <input type="text" name="tempPassword" id="tempPassword" onChange = {(e)=>{setTempPassword(e.target.value)}}/>

        <label htmlFor="newPassword">New Password:</label>
        <input type="text" name="newPassword" id="newPassword" />

        <button type='submit'>Submit</button>
      </form>
    )
  } else if (state === false) {
    return (
      <>
        <div className="body">
          <div className='intiallogin'>
            <form className="login-form">
              <input type="text" placeholder='name' onChange={(e) => setOwnerName(e.target.value)} />
              <input type="password" placeholder='password' onChange={(e) => setOwnerPassword(e.target.value)} />

              <Button className="Btn" size="md" onClick={updatePasswordBtn} >Update Password </Button>

              <Button size="md" className="Btn" onClick={ownerClicked} >Submit </Button>

            </form>
          </div>
        </div>
      </>
    )
  } 
    else{
      return(
        <>
        <div className="grid-container">

          <Card  className="max-w-xs mx-auto" onClick={()=> navigate ("/empdetails")} decoration="top" decorationColor="indigo">
    <Metric>Employee Details</Metric>
  </Card>
  <Card  className="max-w-xs mx-auto" onClick={() =>navigate("/salesdata")} decoration="top" decorationColor="indigo">
    <Metric> Sales Data</Metric>
  </Card>

  <Card  className="max-w-xs mx-auto" onClick={() =>navigate("/newcustomers")} decoration="top" decorationColor="indigo">
    <Metric>Customer Family</Metric>
  </Card>

  <Card  className="max-w-xs mx-auto" onClick={() =>navigate("/customerreviews")} decoration="top" decorationColor="indigo">
    <Metric>Customer Reviews </Metric>
  </Card>

</div>
        </>
      )
    }

}



