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
      <div className="nameoffirm">
        <div className="titlename">
          <div className="logotitle">
          <img className='logoimage' src="https://img.freepik.com/premium-vector/hotel-logo-template-icon-illustration-brand-identity-isolated-flat-illustration-vector-graphic_7109-2953.jpg" />
         <h1>SalesEase</h1>
          </div>
         <h2>
          
          <div class="word-animation">
  <span>Welcome</span>
  <span>.</span>
  <span>.</span>
  <span>.</span>
  <span>SalesEase</span>
  <span>!</span>
  <span>!</span>

</div></h2>
          <h3>Get ready to embark on a journey where managing sales and billing is simpler and more efficient than ever before. We're thrilled to have you join our platform, and we're confident that this new beginning will lead to exciting opportunities and success. Let's start this journey together and achieve great things!!</h3>
          </div>
      </div>
     <div className="body">
       <div className='intiallogin' style={{boxShadow:'-1px 2px 14px -1px rgba(0,0,0,0.34)'}}>
       <form className="login-form" onSubmit={submitBtn}>
        <div className='titlelogo'>
             <img className='logoimagelogin' src="https://img.freepik.com/premium-vector/hotel-logo-template-icon-illustration-brand-identity-isolated-flat-illustration-vector-graphic_7109-2953.jpg" />
<h1>SalesEase</h1>
</div>
        
<div className='formsordering'>

<FaUser  size={20} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} id="outlined-basic" label="Enter Username" variant="outlined" onChange={(e)=>setUserName(e.target.value)} 
 InputLabelProps={{style: {height: 25}}} inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>

<IoKeySharp 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='password' id="outlined-basic" label="Enter Password" variant="outlined" onChange={(e)=>setPassword(e.target.value)}
 inputProps={{style: {height: 20}}}/>
</div>
      <Button size="md" style={{width:'300px',marginLeft:'43px',marginTop:'10px'}} type='submit'>Login</Button>
      {isValid && 
        <p style={{textAlign:'center',color:'red',marginTop:10}}>Wrong Credentials</p>
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
