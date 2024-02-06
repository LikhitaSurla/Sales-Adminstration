import React,{useState,useEffect} from 'react'
import custDetails from '../FetchingData/Customers'
import {Button,Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,Metric,Flex} from "@tremor/react";
import { indexValues } from '../FetchingData/Sales'
import '../Styling/index.css'
import { useNavigate } from 'react-router-dom';


export default function NewCustomers() {

  const[customerCollection,setCustomerCollection]=useState([]);
  const[customerList,setCustomerList]=useState(false);
  const[newCust,setNewCust] = useState(0);
  const navigate = useNavigate();

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

  const checkNewCustPage=()=>{
    setCustomerList(false);
  }
  if(customerList==false){

  return (
    <>
          <Button style={{marginTop:'30px',marginLeft:'30px'}} onClick={()=>navigate('/display/admin/featurespage')}>Back</Button>

    <Title style={{textAlign:'center',marginTop:'20px'}}> OUR CUSTOMER FAMILY</Title>
    <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">

<Button onClick={viewCustomersList} size="xs">View Customer List</Button></Flex>
    <div className='newcutomers'>
  <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
    <Title style={{textAlign:'center',marginBottom:'5px'}}>New Customers</Title>
    <Metric style={{textAlign:'center',padding:'5px'}}>{newCust}</Metric>
  </Card>
<br/>
  
          <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
    <Title style={{textAlign:'center',marginBottom:'5px'}}>  Existing Customers</Title>
    <Metric style={{textAlign:'center',padding:'5px'}}>{customerCollection.length}</Metric>
  </Card>
  
  </div>
 
 
    </>
  )}
  else{
    return(
      <>
      <Card>
        <Button onClick={checkNewCustPage}>Back</Button>
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
