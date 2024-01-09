import React,{useState} from 'react'
import fetchData from '../FetchingData/Data';
import EmpDetails from '../AdminFeaturesPages/EmpDetails';
import { useNavigate} from 'react-router-dom';

export default function Admin(props) {
  const [state,setState] =useState(false);
  const [ownerName,setOwnerName]=useState('');
  const [ownerPassword,setOwnerPassword]=useState('');
  const navigate=useNavigate();

   
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
      <button onClick={()=> navigate ("/empdetails")
      }>Emp details</button>
        <button onClick={() =>navigate("/salesdata")}>Sales Data</button>
        <button onClick={() =>navigate("/newcustomers")}>New Customers </button>
        <button onClick={() =>navigate("/customerreviews")}>Customer Reviews</button>
        
        </>
      )
    }

}



