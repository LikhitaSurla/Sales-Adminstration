import React from 'react'
import Display from './Display'
import fetchData from './FetchingData/Data'
import {useState } from 'react'
import './Styling/index.css'
import { Button } from "@tremor/react";
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { TextField,} from '@mui/material'
import { IoKeySharp } from "react-icons/io5";



export default function LoginPro() {
    const [userName,setUserName]=useState('');
    const [password,setPassword]=useState('');
    const [state,setState] = useState(false);
    const[isValid,setIsValid] = useState(false);
    const navigate = useNavigate();
    const submitBtn =async(e)=>{
      e.preventDefault();
      console.log("Button clicked!");
        try{
            const usersData = await fetchData();
            usersData.forEach((doc)=>{
              if(doc.name===userName && doc.password === password){
                setState(true);
                sessionStorage.setItem('User', "LoggedIn");
              }else{
                setIsValid(true);
                setTimeout(()=>{
                  setIsValid(false)
                },1000)
              }
            });
              if(state==true){
              navigate('/display');
            }
        }
        catch(err){
          console.error(err);
        }
    }
  
    if( state==false){
    return (
      <>
     <div className="body">
       <div className='intiallogin'>
       <form className="login-form" onSubmit={submitBtn}>
        <h1>SalesEase</h1>
        
<div className='formsordering'>

<FaUser  size={20} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} id="outlined-basic" label="Enter Username" variant="outlined" onChange={(e)=>setUserName(e.target.value)} 
 InputLabelProps={{style: {height: 25}}} inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>

<IoKeySharp 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='password' id="outlined-basic" label="Enter Password" variant="outlined" onChange={(e)=>setPassword(e.target.value)}
 inputProps={{style: {height: 20}}}/>
</div>
      <Button size="md" style={{width:'300px',marginLeft:'43px',marginTop:'10px'}} type='submit'>Submit </Button>
      {isValid && 
        <p style={{textAlign:'center'}}>Wrong Credentials</p>
          }

      </form>
      </div>
      </div>
      </>
    )
    }
    else{
      return (
        navigate('/display')
      )
    }
  
}
