import React,{useState,useEffect} from 'react'
import { db } from '../config/firebase';
import custDetails from '../FetchingData/Customers'
import {Button,Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,} from "@tremor/react";
import { indexValues } from '../FetchingData/Sales'

export default function NewCustomers() {

  const[customerCollection,setCustomerCollection]=useState([]);
  const[customerList,setCustomerList]=useState(false);
  const[newCust,setNewCust] = useState(0);

  const indexDetails = async () => {
    try {
      const indexDb = await indexValues();
      indexDb.map((data)=>{
        setNewCust(data.newcustomers)
      })
    } catch (err) {
      console.error(err)
    }
  }

  const customerDetails=async()=>{
    try{
      const customerDb=await custDetails();
      setCustomerCollection(customerDb)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    indexDetails();
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
          new customer count:{newCust}
          <br />
          existing customers:{customerCollection.length}
        </div>
        <Button onClick={viewCustomersList} size="xs">View Customer List</Button>
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
