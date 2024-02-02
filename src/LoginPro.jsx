import React from 'react'
import Display from './Display'
import fetchData from './FetchingData/Data'
import {useState } from 'react'
import './Styling/index.css'
import { Button } from "@tremor/react";
import { useNavigate } from 'react-router-dom';



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
              if(doc.name===userName && doc.password ===password){
                setState(true);
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
      <input type="text" placeholder='Enter your name' onChange={(e)=>setUserName(e.target.value)} />
      <input type="password"  placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} />
      <Button size="md" type='submit'>Submit </Button>
      {isValid && 
        <p style={{textAlign:'center'}}>Worng Credentials</p>
          }

      </form>
      </div>
      </div>
      </>
    )
    }
    else{
      return (
        <>
        <Display/>
        
        </>
      )
    }
  
}
