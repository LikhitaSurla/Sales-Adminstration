import React,{useState,useEffect} from 'react'
import { db } from '../config/firebase';
import custDetails from '../FetchingData/Customers'
import {Button,Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,} from "@tremor/react";


export default function NewCustomers() {

  const[customerCollection,setCustomerCollection]=useState([]);
  const[customerList,setCustomerList]=useState(false);

  const customerDetails=async()=>{
    try{
      const customerDb=await custDetails();
      setCustomerCollection(customerDb)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    customerDetails();
  },[])

  const viewCustomersList=()=>{
    setCustomerList(true);
  }
  if(customerList==false){

  return (
    <>
    <div>NewCustomers</div>
    <div>
          new customer count:
          existing customers:
        </div>
        <Button onClick={viewCustomersList} size="xs">View Customer List</Button>

        {/* <button onClick={viewCustomersList}>View customer list</button> */}
    </>
  )}
  else{
    return(
      <>
      <Card>
    <Title>OUR CUSTOMERS</Title>
    <Table className="mt-5">
      <TableHead>
        <TableRow>
          <TableHeaderCell>NAME</TableHeaderCell>
          <TableHeaderCell>PHONE NUMBER</TableHeaderCell>
          
        </TableRow>
      </TableHead>
      <TableBody>
        {customerCollection.map((data) => (
          <TableRow key={data.phonenumber}>
            <TableCell>{data.name}</TableCell>
            <TableCell>
              <Text>{data.phonenumber}</Text>
            </TableCell>
           
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
        {/* <section>
    {customerCollection.map((data) => (
            <div key={data.phonenumber}>
                <h1>{data.name}</h1>
                <h3>{data.phonenumber}</h3> 
            </div>
        ))}  
        </section> */}
         </>
    )
  }
}
