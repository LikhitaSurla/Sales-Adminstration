import React,{useState} from 'react'
import fetchData from './FetchingData/Data';
import EmpDetails from './EmpDetails';
import {Link} from 'react-router-dom';

export default function Admin(props) {
  const [state,setState] =useState(false);
  const [ownerName,setOwnerName]=useState('');
  const [ownerPassword,setOwnerPassword]=useState('');

   
    const ownerClicked =async()=>{
      let matchfound = false;
      try{
          const usersData = await fetchData();
          usersData.forEach((doc)=>{
           
            if(doc.name == ownerName && doc.password == ownerPassword){
              matchfound = true;
            
            }
          });
          if(matchfound){
            setState(true);
          }
      }
      catch(err){
        console.error(err);
      }
  }
  // const emploData=()=>{
  //   <EmpDetails/>
  // }
    if(state==false){
      return (
        <>
        
        <input type="text" placeholder='name' onChange={(e)=>setOwnerName(e.target.value)} />
        <input type="password" placeholder='password' onChange={(e)=>setOwnerPassword(e.target.value)} />
        <button
        >Update my Password</button>
        <button onClick={ownerClicked}>submit</button>

        </>
      )
    }
    else{
      return(
        <>
{/*         
        <button>Sales Details</button>
        <button onClick={emploData}>Employee Details</button>
        <button>New Customer</button>
        <button>Customer Reviews</button> */}
       
        <Link to="./EmpDetails">
          <button>Employee Details</button>
        </Link>
        <Link to="./SalesDetails">
          <button>Sale Details</button>
        </Link>
        </>
      )
    }

}
