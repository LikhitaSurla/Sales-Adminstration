import { useState } from 'react'
import './App.css'
import { db } from './config/firebase'
import {collection ,getDocs } from 'firebase/firestore'
import Billing from './Billing'
import Display from './Display'

function App() {
  const [userName,setUserName]=useState('');
  const [password,setPassword]=useState('');
  const [state,setState] = useState(false);

  const submitBtn = async () => {
    const userCollectionRef = collection(db, 'userdata');
    let matchFound = false;
  
    try {
      const userCredentials = await getDocs(userCollectionRef);
      userCredentials.forEach((doc) => {
        const data = doc.data();
  
        if (data.name === userName && data.password === password) {
          matchFound = true;
        }
      });
  
      if (matchFound){
        setState(true);
      } else {
        console.log('Unmatched');
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
    }
  };
  if(state==false){
  return (
    <>
    <input type="text" placeholder='enter your name' onChange={(e)=>setUserName(e.target.value)} />
    <input type="password" placeholder='enter your password' onChange={(e)=>setPassword(e.target.value)} />
    <button onClick={submitBtn}> submit</button>
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
