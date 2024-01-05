import { useEffect, useState } from 'react'
import './App.css'
import { db } from './config/firebase'
import {collection ,getDocs } from 'firebase/firestore'
import Billing from './Billing'
import Display from './Display'
import fetchData from './Data'

function App() {
  const [userName,setUserName]=useState('');
  const [password,setPassword]=useState('');
  const [state,setState] = useState(false);
  
  const[dataArray,setDataArray] = useState([{}]);

  useEffect(()=>{
    const dataFetching = async()=>{
      try{
       const temp = await fetchData();
       
      }catch(err){
        console.log(err);
      }
    }
    dataFetching();
  },[]);

  if(state==false){
  return (
    <>
    <input type="text" placeholder='enter your name' onChange={(e)=>setUserName(e.target.value)} />
    <input type="password" placeholder='enter your password' onChange={(e)=>setPassword(e.target.value)} />
    {/* <button onClick={submitBtn}> submit</button> */}
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
export default App
