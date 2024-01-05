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
  const [userName,setUserName]=useState('');
  const [password,setPassword]=useState('');

  
  const userCollectionRef = collection(db,'userdata');
  const getUserList = async()=>{
    try{
      const data = await getDocs(userCollectionRef);
      const filterData = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
      setUserList(filterData)
      console.log(userList[0].name
        )

    }
    catch(err){
      console.error(err);
    }
  }
  useEffect(()=>{
    getUserList();
  },[])

  const submitBtn=()=>{
    {userName==userList[0].name && password==userList[0].password ? console.log('hi') : console.log('bye')}

  }
  return (
    <>
    
    <input type="text" placeholder='enter your name' onChange={(e)=>setUserName(e.target.value)} />
    <input type="password" placeholder='enter your password' onChange={(e)=>setPassword(e.target.value)} />

<button onClick={submitBtn}> submit</button>
    {/* {userName==filterData[0].name && password==filterData[0].password ? <Billing/> :<Display/>} */}
    </>
  )
}

export default App
