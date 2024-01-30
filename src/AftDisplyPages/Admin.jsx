import React,{useState} from 'react'
import fetchData from '../FetchingData/Data';
import EmpDetails from '../AdminFeaturesPages/EmpDetails';
import { useNavigate} from 'react-router-dom';
import { Button ,Card, Metric, Text } from "@tremor/react";
import '../Styling/index.css'

export default function Admin(props) {
  const [state,setState] =useState(false);
  const [ownerName,setOwnerName]=useState('');
  const [ownerPassword,setOwnerPassword]=useState('');
  const navigate=useNavigate();

   
    const ownerClicked =async(e)=>{
      e.preventDefault();

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
        <div className="body">
       <div className='intiallogin'>
       <form className="login-form">
        <input type="text" placeholder='name' onChange={(e)=>setOwnerName(e.target.value)} />
        <input type="password" placeholder='password' onChange={(e)=>setOwnerPassword(e.target.value)} />
        
        <Button className="Btn" size="md" >Update Password </Button>

        <Button size="md" className="Btn" onClick={ownerClicked} >Submit </Button>

        </form>
      </div>
      </div>
        </>
      )
    }
    else{
      return(
        <>
        <div className="grid-container">

          <Card  className="max-w-xs mx-auto" onClick={()=> navigate ("/empdetails")} decoration="top" decorationColor="indigo">
    <Metric>Employee Details</Metric>
  </Card>
  <Card  className="max-w-xs mx-auto" onClick={() =>navigate("/salesdata")} decoration="top" decorationColor="indigo">
    <Metric> Sales Data</Metric>
  </Card>

  <Card  className="max-w-xs mx-auto" onClick={() =>navigate("/newcustomers")} decoration="top" decorationColor="indigo">
    <Metric>Customer Family</Metric>
  </Card>

  <Card  className="max-w-xs mx-auto" onClick={() =>navigate("/customerreviews")} decoration="top" decorationColor="indigo">
    <Metric>Customer Reviews </Metric>
  </Card>

</div>
        </>
      )
    }

}



