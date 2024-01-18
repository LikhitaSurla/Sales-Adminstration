import React,{useState,useEffect} from 'react'
import { db } from '../config/firebase';
import custDetails from '../FetchingData/Customers'

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
        <button onClick={viewCustomersList}>View customer list</button>
    </>
  )}
  else{
    return(
      <>
      <p>hoo</p>
        <section>
    {customerCollection.map((data) => (
            <div key={data.phonenumber}>
                <h1>{data.name}</h1>
                <h3>{data.phonenumber}</h3> 
            </div>
        ))}  
        </section> </>
    )
  }
}
