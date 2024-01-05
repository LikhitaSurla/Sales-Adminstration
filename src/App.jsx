import { useState , useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { db } from './config/firebase'
import {collection ,getDocs } from 'firebase/firestore'
import Billing from './Billing'

function App() {
  

  const [count, setCount] = useState(0)
  const [userList,setUserList] = useState([]);
  const [userName,setUserName]=useState('vijay');
  const [password,setPassword]=useState('vija');
 
  
  


  const submitBtn = async () => {
    const userCollectionRef = collection(db, 'userdata');
        
    try {
      const userCredentials = await getDocs(userCollectionRef);
  
      userCredentials.forEach((doc) => {
        const data = doc.data();
         const named=data.name;
         const pass =data.password;
      });
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
      // You might want to handle the error appropriately (e.g., display an error message)
    }

    
    if (named === userName && pass === password) {
      console.log('Credentials matched for user:', userName);
      console.log('User Data:', data);
      // You might want to perform further actions upon successful login
    } else {
      console.log('Credentials do not match for user:', userName);
    }
  };
  return (
    <>
    
    {/* <input type="text" placeholder='enter your name' onChange={(e)=>setUserName(e.target.value)} />
    <input type="password" placeholder='enter your password' onChange={(e)=>setPassword(e.target.value)} /> */}

<button onClick={submitBtn}> submit</button>
    {/* {userName==filterData[0].name && password==filterData[0].password ? <Billing/> :<Display/>} */}
    </>
  )
}

export default App
