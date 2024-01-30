import React from 'react'
import { useState } from 'react';
import Billing from './AftDisplyPages/Billing';
import Admin from './AftDisplyPages/Admin';
import './Styling/index.css'
import { Button, Card, Flex, Text, Title } from "@tremor/react";


export default function Display() {

  const [state,setState] = useState(true);
  // const[billState,setBillState] = useState(false);
  const [matchFound,setMatchFound] = useState(false)
  
  const newBill = ()=>{
    console.log('hii')
    setState(false);
  }
  const ownerLogin=async()=>{
    setMatchFound(true);
  }

  if(matchFound){
    return(
      <>
      <Admin/>
      </>
    )
  }
  else if(state){
    return (
    <>
    <div className="body">
             <Button size="lg" onClick={newBill}> + New Bill</Button>
    </div>
      <Button size="xs" className='adminlogin' onClick={ownerLogin}>Admin</Button>
    </>
  )}
    
  else{ 
    return( <Billing/>);
  }
}





//   else if(state===false && billState==false){
//       return(
//        <>
//        <div className='employesubmit'>
//         <form onSubmit={idSubmit}>
//        <Card className="max-w-sm mx-auto">
//      <p> Employee Id :<span>  </span>
//           <input type="text" placeholder='service id' onChange={(e)=>setEmpId(e.target.value)} required/></p>
//       <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">
//         <Button size="xs" type='submit' variant="primary">
// Submit </Button>
//       </Flex>
//     </Card>
//     </form>
//     </div>
          

//        </>
//       )
//   }
//   else if(state===false && billState==true){
//     return(
//           <>
//           <Billing empId={empId}/>
//           </>
//     )
//   }
// }


