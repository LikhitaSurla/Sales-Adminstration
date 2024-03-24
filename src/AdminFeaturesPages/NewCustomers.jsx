import React,{useState,useEffect} from 'react'
import custDetails from '../FetchingData/Customers'
import {Button,Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,Metric,Flex} from "@tremor/react";
import { indexValues } from '../FetchingData/Sales'
import '../Styling/index.css'
import { useNavigate } from 'react-router-dom';
import 'ldrs/bouncy';
import { MdKeyboardBackspace } from "react-icons/md";


export default function NewCustomers() {

  const[customerCollection,setCustomerCollection]=useState([]);
  const [hasSessionData, setHasSessionData] = useState(false);
  const [hasAdminSessionData, setHasAdminSessionData] = useState(false);
  const[customerList,setCustomerList]=useState(false);
  const[newCust,setNewCust] = useState(0);
  const[loading,setLoading] = useState(true);
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
  setTimeout(()=>{
    setLoading(false);
  },800)
  useEffect(()=>{
    const checkSessionData = async () => {
      const dataInSession = sessionStorage.getItem('User');
      const dataInAdminSession = sessionStorage.getItem('admin');
      if(dataInAdminSession && dataInSession){
        setHasSessionData(true);
        setHasAdminSessionData(true);
      }
      else if (dataInSession){ 
        if(!dataInAdminSession){
          navigate('/display')
        }
      }
      else if(!dataInSession){
        navigate('/')
      }
    };
    indexDetails();
    customerDetails();
    checkSessionData();
  },[])

  const viewCustomersList=()=>{
    setCustomerList(true);
  }

  const checkNewCustPage=()=>{
    setCustomerList(false);
  }

  if(loading && hasAdminSessionData && hasSessionData){
    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <l-bouncy
        size="45"
        speed="1.75"
        color="#0A1052" 
      ></l-bouncy>
    </div>
    )
  }
  else if(customerList==false && hasSessionData && hasAdminSessionData){

  return (
    <>
    <Title style={{textAlign:'center',marginTop:'35px',marginBottom:'-45px'}}><b> OUR CUSTOMER FAMILY</b></Title>
          <button className='backToFeaturesPage' style={{marginLeft:13}} onClick={()=>navigate('/display/admin/featurespage')}> 
          <MdKeyboardBackspace color='black' style={{marginLeft:'8px'}} size={30}/>
</button>
    <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">

</Flex>
    <div className='newcutomers'>
  <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo" style={{boxShadow:'-1px 2px 14px -1px rgba(0,0,0,0.34)'}}>
    <Title style={{textAlign:'center',marginBottom:'5px'}}>New Customers Today</Title>
    <Metric style={{textAlign:'center',padding:'5px'}}>{newCust}</Metric>
  </Card>
<br/>
  
          <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo" style={{boxShadow:'-1px 2px 14px -1px rgba(0,0,0,0.34)'}}>
    <Title style={{textAlign:'center',marginBottom:'5px'}}>  Existing Customers</Title>
    <Metric style={{textAlign:'center',padding:'5px'}}>{customerCollection.length}</Metric>
  </Card>
  
  </div>
    <Title style={{textAlign:'center',marginTop:'-30px',marginBottom:'8px'}} ><b>OUR CUSTOMERS</b></Title>
  <div  className="customerdetailspages" >
  <Card>
    <Table className="mt-4" >
      <TableHead>
        <TableRow >
          <TableHeaderCell><b>NAME</b></TableHeaderCell>
          <TableHeaderCell><b>PHONE NUMBER</b></TableHeaderCell>
          
        </TableRow>
      </TableHead>
      <TableBody  >
        {customerCollection.map((data) => (
          <TableRow key={data.phonenumber} >
            <TableCell>{data.name}</TableCell>
            <TableCell>
              <Text>{data.phonenumber}</Text>
            </TableCell>
           
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
     
  </div>
 
 
    </>
  )}
  
}