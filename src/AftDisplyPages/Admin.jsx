import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import fetchData from '../FetchingData/Data';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Metric,Flex } from "@tremor/react";
import '../Styling/index.css';
import { collection, getDoc, getDocs,doc, query,updateDoc,where } from 'firebase/firestore';

export default function Admin() {
  const [state, setState] = useState(false);
  const [passState, setPassState] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isValid,setIsValid] = useState(false);
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

  const formSubmitted = async (e) => {
    e.preventDefault();
    setIsValid(false)
    try {
      let userId = e.target.userId.value;
      let newPassword = e.target.newPassword.value;
      let tempPassword = e.target.tempPassword.value;
      console.log(newPassword)
      const q = query(collection(db, "userdata"), where("id", "==", Number(userId)));
      const getData = await getDocs(q);
      getData.forEach(async (val) => {
        if (val.data().id === Number(userId) && val.data().password === tempPassword) {
          const userDocRef = doc(db, "userdata", val.id);
          try {
            await updateDoc(userDocRef,{
              password: newPassword,
            });
            setIsValid(true)
            setTimeout(()=>{
              setIsValid(false);  
            },2000)
          } catch (error) {
            console.error(error);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
    setPassState(false)
    setState(false)

  };
  

  if (passState) {
    return (
      <div className="body">
        <Card className='update-form'>
      <form onSubmit={formSubmitted}>
        <p>
        Username : <span>  </span><input type="text" name="userId" id="userId" /></p>
        <p>Temporary Password :<span>  </span><input type="text" name="tempPassword" id="tempPassword" /></p>

       <p> New Password: <span>  </span>
        <input type="text" name="newPassword" id="newPassword" /></p>


        <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">
        <Button type='submit'>Submit</Button></Flex>
      </form>
      </Card>
        </div>
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
              {isValid && 
                <p> Password Updated Successfully</p>
              }
            </form>
          </div>
        </div>
      </>
    )
  } 
    else{
      return(
        <>
        <div className='center-container'>
        <div className="grid-container">

          <Card  className="cardcontainer" onClick={()=> navigate ("/empdetails")} decoration="top" decorationColor="indigo">
    <Metric>Employee Details</Metric>
  </Card>
  <Card  className="cardcontainer" onClick={() =>navigate("/salesdata")} decoration="top" decorationColor="indigo">
    <Metric> Sales Data</Metric>
  </Card>

  <Card  className="cardcontainer" onClick={() =>navigate("/newcustomers")} decoration="top" decorationColor="indigo">
    <Metric>Customer Family</Metric>
  </Card>

  <Card  className="cardcontainer" onClick={() =>navigate("/customerreviews")} decoration="top" decorationColor="indigo">
    <Metric>Customer Reviews </Metric>
  </Card>

</div>
</div>
        </>
      )
    }

}



