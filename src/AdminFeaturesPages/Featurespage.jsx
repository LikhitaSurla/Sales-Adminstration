import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, Metric,Flex,Title } from "@tremor/react";
import '../Styling/index.css';

export default function Featurespage() {
    const navigate = useNavigate();
    const [hasSessionData, setHasSessionData] = useState(false);
    const [hasAdminSessionData, setHasAdminSessionData] = useState(false);
    useEffect(()=>{
      const checkSessionData = async () => {
        const dataInSession = sessionStorage.getItem('User');
        const dataInAdminSession = sessionStorage.getItem('admin');
        if(dataInAdminSession && dataInSession){
          setHasSessionData(true);
          setHasAdminSessionData(true);
        }
        else if (dataInSession && !dataInAdminSession) {
            navigate('/display')
        }
        else if(!dataInSession){
          navigate('/')
        }
      };
      checkSessionData();
    },[])
    
  if(hasSessionData && hasAdminSessionData){

    const logOutAdmin=()=>{
      setHasAdminSessionData(false)
      navigate('/display')
    }
    if(hasSessionData && hasAdminSessionData){
  return (
   <>
   <Button onClick={logOutAdmin}>Logout</Button>
   <div className='center-container'>
        <div className="grid-container">

          <Card  className="cardcontainer" onClick={()=> navigate ("/display/admin/featurespage/empdetails")} decoration="top" decorationColor="indigo">
    <Metric>Employee Details</Metric>
  </Card>
  <Card  className="cardcontainer" onClick={() =>navigate("/display/admin/featurespage/salesdata")} decoration="top" decorationColor="indigo">
    <Metric> Sales Data</Metric>
  </Card>

  <Card  className="cardcontainer" onClick={() =>navigate("/display/admin/featurespage/newcustomers")} decoration="top" decorationColor="indigo">
    <Metric>Customer Family</Metric>
  </Card>

  <Card  className="cardcontainer" onClick={() =>navigate("/display/admin/featurespage/customerreviews")} decoration="top" decorationColor="indigo">
    <Metric>Customer Reviews </Metric>
  </Card>

</div>
</div>
   </>
  )
}
}
}