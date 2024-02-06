import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Card, Metric,Flex,Title } from "@tremor/react";
import '../Styling/index.css';

export default function Featurespage() {
    const navigate = useNavigate();

  return (
   <>
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
