import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import fetchData from '../FetchingData/Data';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Metric,Flex,Title } from "@tremor/react";
import '../Styling/index.css';
import { collection, getDoc, getDocs,doc, query,updateDoc,where } from 'firebase/firestore';
import { FaUser } from "react-icons/fa";
import { TextField,} from '@mui/material'
import { IoKeySharp } from "react-icons/io5";
import { FaUserLock } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";



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
      console.log(username)
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

  const logoutAdmin=()=>{
    setPassState(false)
  }
  
  
  if (passState && hasSessionData) {
    return (
      <div className="body">
        <Card className='update-form '>
        <Title style={{textAlign:'center',marginBottom:'35px'}}>UPDATE PASSWORD 
</Title>
<button className='adminClickedBack' onClick={logoutAdmin} >X</button>
      <form onSubmit={formSubmitted}>
        
      <div className='formsordering'>

<FaUser  size={20} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} id="outlined-basic"  name="userId" label="Enter Username" variant="outlined" 
 InputLabelProps={{style: {height: 25}}} inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>

<IoKeySharp 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='password' name="tempPassword" id="outlined-basic" label="Enter Previous Password" variant="outlined" 
 inputProps={{style: {height: 20}}}/>
</div>
<div className='formsordering'>

<FaUserLock 

 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='password' name="newPassword" id="outlined-basic" label="Enter New Password" variant="outlined" 
 inputProps={{style: {height: 20}}}/>
</div>
    

        <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">
        <Button type='submit' style={{width:'140px',marginTop:'2px',height:'40px' }}>Update</Button></Flex>
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
             <Title style={{textAlign:'center',marginBottom:'15px'}}>ADMIN LOGIN</Title>
              <div className='formsordering'>

<FaUser  size={20} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} id="outlined-basic"  name="userId" label="Enter Username" variant="outlined" 
  onChange={(e) => setOwnerName(e.target.value)} InputLabelProps={{style: {height: 25}}} inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>

<IoKeySharp 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='password' name="tempPassword" id="outlined-basic" label="Enter Password" variant="outlined" onChange={(e) => setOwnerPassword(e.target.value)} 
 inputProps={{style: {height: 20}}}/>
</div>
 <div className='adjustingAdminBtn'>
              <Button size="md" className="Btn" style={{width:'145px',marginTop:'10px',height:'40px',marginLeft:'50px' }} onClick={ownerClicked} >Submit </Button>
              <Button className="Btn" size="md" style={{width:'145px',marginTop:'10px',height:'40px',marginRight:'50px' }} onClick={updatePasswordBtn} >Update Password </Button></div>
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



