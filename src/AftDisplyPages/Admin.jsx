import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import fetchData from '../FetchingData/Data';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Metric,Flex,Title } from "@tremor/react";
import '../Styling/index.css';
import { collection, getDoc, getDocs,doc, query,updateDoc,where } from 'firebase/firestore';

export default function Admin() {
  const [state, setState] = useState(false);
  const [passState, setPassState] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isValid,setIsValid] = useState(false);
  const [hasSessionData, setHasSessionData] = useState(false);
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
          sessionStorage.setItem('admin','adminLoggedIn');
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
      let username = e.target.userId.value;
      let newPassword = e.target.newPassword.value;
      let tempPassword = e.target.tempPassword.value;
      const q = query(collection(db, "userdata"), where("name", "==", username));
      const getData = await getDocs(q);
      getData.forEach(async (val) => {
        if (val.data().name === username && val.data().password === tempPassword) {
          const userDocRef = doc(db, "userdata", val.id);
          try {
            await updateDoc(userDocRef,{
              password: newPassword,
            });
            setIsValid(true)
            setTimeout(()=>{
              setIsValid(false);  
            },1000)
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

  useEffect(()=>{
    const checkSessionData = async () => {
      const dataInSession = sessionStorage.getItem('User');
      if (!dataInSession) {
        navigate('/');
      } else {
        setHasSessionData(true);
      }
    };
    checkSessionData();
    
  },[])
  
  
  if (passState && hasSessionData) {
    return (
      <div className="body">
        <Card className='update-form '>
        <Title style={{textAlign:'center',marginBottom:'15px'}}>UPDATE PASSWORD</Title>
      <form onSubmit={formSubmitted}>
        
        <p>
       <input style={{width:'300px'}} type="text" name="userId" id="userId" placeholder='Enter Username'/></p>
        <p><input style={{width:'300px'}} type="text" name="tempPassword" id="tempPassword" placeholder='Enter Previous Password' /></p>

       <p>
        <input style={{width:'300px',marginBottom:'-20px'}} type="text" name="newPassword" id="newPassword" placeholder='Enter New Password' /></p>


        <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">
        <Button type='submit'>Submit</Button></Flex>
      </form>
      </Card>
        </div>
    )
  } else if (state === false && hasSessionData) {
    return (
      <>
        <div className="body">
          <div className='intiallogin'>
            <form className="login-form">
              <input type="text" placeholder='name' onChange={(e) => setOwnerName(e.target.value)} />
              <input type="password" placeholder='password' onChange={(e) => setOwnerPassword(e.target.value)} />
              <Button size="md" className="Btn" onClick={ownerClicked} >Submit </Button>
              <Button className="Btn" size="md" onClick={updatePasswordBtn} >Update Password </Button>
              {isValid && 
                <p style={{textAlign:'center'}}>Password Updated Successfully</p>
              }
            </form>
          </div>
        </div>
      </>
    )
  } 
    else{
      return(
       
      navigate('/display/admin/featurespage')
      
      )
    }

}



