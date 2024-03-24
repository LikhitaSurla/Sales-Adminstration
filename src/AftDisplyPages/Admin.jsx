import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import fetchData from '../FetchingData/Data';
import { useNavigate } from 'react-router-dom';
import { Button, Card,Flex,Title } from "@tremor/react";
import '../Styling/index.css';
import { collection,getDocs,doc, query,updateDoc,where } from 'firebase/firestore';
import { TextField,} from '@mui/material'
import {FaUser,FaUserLock,IoKeySharp} from "../exp/reacticons"


export default function Admin() {
  const [state, setState] = useState(false);
  const [passState, setPassState] = useState(false);
  const [isValid,setIsValid] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [hasSessionData, setHasSessionData] = useState(false);
  const[isNotPresent,setIsNotPresent] = useState(false);
  const [isInvalid,setIsInvalid] =useState(false)
  const [isPasswordOk,setIsPasswordOk] =useState(false)
  const navigate = useNavigate();
  const updatePasswordBtn = () => {
    setPassState(true);
  }
  const ownerClicked = async (e) => {
    let matchfound =false
    e.preventDefault();
    try {
      const usersData = await fetchData();
      usersData.forEach((doc) => {
        if (doc.name === ownerName && doc.password === ownerPassword) {
          matchfound = true;
          sessionStorage.setItem('admin','adminLoggedIn');
        }
      });
      setIsNotPresent(true);
      setTimeout(()=>{
        setIsNotPresent(false);
      },1500)
      if (matchfound) {
        setState(true);
      }
      else{

      }
    } catch (err) {
      console.error(err);
    }
  }
  const formSubmitted = async (e) => {
    e.preventDefault();
    setIsValid(false);
    try {
      let username = e.target.userId.value;
      let newPassword = e.target.newPassword.value;
      let tempPassword = e.target.tempPassword.value;
      const q = query(collection(db, "userdata"), where("name", "==", username));
      const getData = await getDocs(q);
      if(newPassword ==' ' || newPassword.length<8){
        setIsPasswordOk(true)
        setTimeout(()=>{
          setIsPasswordOk(false)
        },1200)
      }
      else{
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
            },1500)
            setPassState(false)
          } catch (error) {
            console.error(error);
          }
        }
        else{
          setIsInvalid(true);
          setTimeout(()=>{
            setIsInvalid(false);
          },1500)
        }
      });
    }
    } catch (error) {
      console.error(error);
    }
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
   const logoutAdminop=()=>{
    navigate('/display')
  }
  
  
  if (passState && hasSessionData) {
    return (
      <div className="body2">
        <Card className='update-form ' style={{boxShadow:'-1px 2px 14px -1px rgba(0,0,0,0.34)'}}>
        <Title style={{textAlign:'center',marginBottom:'35px'}}>UPDATE PASSWORD 

<button className='adminClickedBack' onClick={logoutAdmin} >X</button></Title>
      <form onSubmit={formSubmitted}>
        
      <div className='formsordering'>

<FaUser  size={20} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField required style={{width:'300px'}} id="outlined-basic"  name="userId" label="Enter Username" variant="outlined" 
 InputLabelProps={{style: {height: 25}}} inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>

<IoKeySharp 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField required style={{width:'300px'}} type='password' name="tempPassword" id="outlined-basic" label="Enter Previous Password" variant="outlined" 
 inputProps={{style: {height: 20}}}/>
</div>
<div className='formsordering' style={{marginBottom:-10}}>

<FaUserLock 

 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField required style={{width:'300px'}} type='password' name="newPassword" id="outlined-basic" label="Enter New Password" variant="outlined" 
 inputProps={{style: {height: 20}}}/>
</div>
    

        <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">
        <Button type='submit' style={{width:'140px',marginTop:'2px',height:'40px'}}>Update</Button></Flex>

        {isInvalid && <p style={{textAlign:'center',color:'red',marginTop:5,fontFamily:'arial'}}>Invalid User Tried</p>} 
        {
                isPasswordOk && <p style={{textAlign:'center',color:'red',marginTop:5}}>*Password must contain minimum 8 characters</p>
              }
      </form>
      </Card>
        </div>
    )
  } else if (state === false && hasSessionData) {
    return (
      <>
        <div className="body2">
          <div className='intiallogin2' style={{boxShadow:'-1px 2px 14px -1px rgba(0,0,0,0.34)',height:'315px'}}>
            <form className="login-form" >
             <Title  style={{textAlign:'center',marginBottom:15}}>ADMIN LOGIN</Title>
             <button className='adminloginback' onClick={logoutAdminop} >X</button>
   </form>
   <form onSubmit={formSubmitted}>
              <div className='formsordering'>

<FaUser  size={20} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField required style={{width:'300px'}} id="outlined-basic"  name="userId" label="Enter Username" variant="outlined" 
  onChange={(e) => setOwnerName(e.target.value)} InputLabelProps={{style: {height: 25}}} inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>

<IoKeySharp 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField required style={{width:'300px'}} type='password' name="tempPassword" id="outlined-basic" label="Enter Password" variant="outlined" onChange={(e) => setOwnerPassword(e.target.value)} 
 inputProps={{style: {height: 20}}}/>
</div>
 <div className='adjustingAdminBtn'>
              <Button size="md" className="Btn" style={{width:'145px',marginTop:'10px',height:'40px',marginLeft:'50px' }} onClick={ownerClicked} >Login </Button>
              <Button className="Btn" size="md" style={{width:'145px',marginTop:'10px',height:'40px',marginRight:'50px' }} onClick={updatePasswordBtn} >Update Password </Button></div>
              {isNotPresent && <p style={{textAlign:'center',color:'red'}}>Invalid Admin Details</p>}
              {isValid && 
                <p style={{textAlign:'center',color:'green'}}>Password Updated Successfully</p>
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