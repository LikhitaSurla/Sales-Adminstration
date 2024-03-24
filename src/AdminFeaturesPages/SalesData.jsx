import React, { useState, useEffect } from 'react';
import { fetchSales } from '../FetchingData/Sales';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,BarChart, Bar, AreaChart, Area,} from 'recharts';
import '../Styling/index.css';
import {Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,Button,Metric,Flex,TabGroup,TabList,Tab,TabPanels,TabPanel,} from '@tremor/react';
import { indexValues } from '../FetchingData/Sales'
import {  collection,doc,  } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import 'ldrs/bouncy'
import { MdKeyboardBackspace } from "react-icons/md";


export default function SalesData() {
  const [salesCollection, setSalesCollection] = useState([]);
  const [indexCollection, setIndexCollection] = useState([]);
  const [viewSalesData, setViewSalesData] = useState(false);
  const indexCollectionRef = collection(db, 'indexes')
  const documentId = 'WH23CKiI1e0rKiGaKz4R';
  const indexDocumentRef = doc(indexCollectionRef, documentId);
  const [hasSessionData, setHasSessionData] = useState(false);
  const [hasAdminSessionData, setHasAdminSessionData] = useState(false);
  const[loading,setLoading] = useState(true);
  const navigate = useNavigate();

  const salesDetails = async () => {
    try {
      const salesDb = await fetchSales();
      const sortedSales = salesDb.sort((a, b) => a.billid - b.billid);

      setSalesCollection(sortedSales);
    } catch (err) {
      console.error(err);
    }
  };
 
  const indexDetails=async()=>{
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    try{
     const indexDb = await indexValues();
     setIndexCollection(indexDb);
    }
    catch{
      console.error(error);
    }
  }
  setTimeout(()=>{
    setLoading(false)
  },800)
  useEffect(() => {
    const checkSessionData = async () => {
      const dataInSession = sessionStorage.getItem('User');
      const dataInAdminSession = sessionStorage.getItem('admin'); 
      if(dataInSession && dataInAdminSession){
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
    salesDetails();
    indexDetails();
    checkSessionData();
  }, []);


  const viewData = () => {
    setViewSalesData(true);
  };


  const aggregateSales = (salesDb) => {
  const dailyAggregatedData = salesDb.reduce((acc, data) => {
    const key = `${data.date}-${data.month}-${data.year}`;

    if (!acc[key]) {
      acc[key] = { date: key, dailysales: 0, totalsales: data.purchase };
    }
    acc[key].dailysales += data.purchase;

    return acc;
  }, {});

  const monthlyAggregatedData = salesDb.reduce((acc, data) => {
    const monthKey = `${data.month}-${data.year}`;

    if (!acc[monthKey]) {
      acc[monthKey] = { date: monthKey, monthlysales: 0, monthlytotalsales: data.purchase };
    }

    acc[monthKey].monthlysales += data.purchase;

    return acc;
  }, {});

  return { dailySales: Object.values(dailyAggregatedData), monthlySales: Object.values(monthlyAggregatedData) };
};

const viewSalesStat=()=>{
  setViewSalesData(false);
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
  else if (viewSalesData && hasSessionData && hasAdminSessionData) {
    return (
      <>
      <button className='backToFeaturesPage' style={{marginLeft:13}} onClick={viewSalesStat}>
      <MdKeyboardBackspace color='black' style={{marginLeft:'8px'}} size={30}/>
      </button>
    <Title style={{textAlign:'center',marginTop:'-30px',marginBottom:'15px'}}><b>SALES DATA</b></Title>
        <Card>
     <Table className="mt-4">
       <TableHead>
         <TableRow>
           <TableHeaderCell>BILL-ID</TableHeaderCell>
           <TableHeaderCell>DATE</TableHeaderCell>
           <TableHeaderCell>NAME</TableHeaderCell>
           <TableHeaderCell>PURCHASE</TableHeaderCell>
         </TableRow>
       </TableHead>
       <TableBody>
         {salesCollection.map((data) => (     
                <TableRow key={data.billid}>
             <TableCell>{data.billid}</TableCell>
             <TableCell>{data.date}-{data.month}-{data.year}</TableCell>

             <TableCell>
               <Text>{data.name}</Text>
             </TableCell>
             <TableCell>
               <Text>{data.purchase}</Text>
             </TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
   </Card>


      
      </>
    );
  } else if(hasSessionData && hasAdminSessionData){
    return (
      <>
        <Title style={{textAlign:'center',marginTop:'36px',fontFamily:'Arial'}}> <b>SALES DATA</b></Title>
      <button className='backToFeaturesPage' style={{marginLeft:13,marginTop:'-38px',float:'left'}} onClick={()=>navigate("/display/admin/featurespage")}>      <MdKeyboardBackspace color='black' style={{marginLeft:'8px'}} size={30}/>
</button>

        <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">
          <Button size="xs" onClick={viewData}> View Data</Button></Flex>
          <div className='salescards'>
  {indexCollection.map((data, index) => (
    <React.Fragment key={index}>
      <Card className="cards-container" decoration="top" decorationColor="yellow" style={{backgroundColor:"#F0F0F0"}}>
        <Title style={{fontSize:'23px',marginTop:'5px',marginLeft:'25px'}}>Today Sales</Title>
        <div style={{marginTop:'65px',marginRight:'70px'}}>
        <Metric style={{color:'#910A67',fontWeight:'bold'}}>{'\u20B9'}{data.dailysales}</Metric>
        </div>
      </Card>

      <Card className="cards-container" decoration="top" decorationColor="yellow" style={{backgroundColor:"#F0F0F0"}}>
        <Title style={{fontSize:'23px',marginTop:'5px',marginLeft:'25px'}} >Month Sales</Title>
        <div style={{marginTop:'65px',marginRight:'70px'}}> 
        <Metric style={{color:'green',fontWeight:'bold'}}>{'\u20B9'}{data.monthlysales }</Metric>
        </div>
      </Card>

      <Card className="cards-container" decoration="top" decorationColor="yellow" style={{backgroundColor:"#F0F0F0"}}>
        <Title style={{fontSize:'23px',marginTop:'5px',marginLeft:'25px'}}>Total Sales</Title>
        <div style={{marginTop:'65px',marginRight:'70px'}}> 
        <Metric style={{color:'#151965',fontWeight:'bold'}}>{'\u20B9'}{data.totalsales }</Metric>
        </div>
      </Card>
    </React.Fragment>
  ))}
</div>

        <div>
       <TabGroup  justifyContent='center'>
        <TabList className="mt-8">
          <Tab ><Title>Daily Sales</Title></Tab>
          <Tab ><Title>Monthly Sales</Title></Tab>
          <Tab ><Title>Bill-Wise Sales</Title></Tab>
          <Tab ><Title>Total Sales</Title></Tab>
        </TabList>
        <TabPanels>      


          <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Flex className="space-x-2" justifyContent="center">
                
                <Card className='graph-card'>
                <TabGroup  justifyContent='center'>
        <TabList className="mt-8">
          <Tab ><Title>Line Graph</Title></Tab>
          <Tab ><Title>Bar Graph</Title></Tab>
          

        </TabList>
        <TabPanels>

<TabPanel>
<LineChart width={1200} height={400} data={aggregateSales(salesCollection).dailySales}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="dailysales" stroke="#8884d8" strokeWidth={2} name="Today Sale" />
  </LineChart>

</TabPanel>
<TabPanel>
<BarChart width={1200} height={400} data={aggregateSales(salesCollection).dailySales}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="dailysales" fill="#8884d8" />
  </BarChart>

</TabPanel>
        </TabPanels>
        </TabGroup>
</Card>
                </Flex>
              </Flex>
            </div>
 </TabPanel>

 <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Flex className="space-x-2" justifyContent="center">
                
                <Card className='graph-card'>
                <TabGroup  justifyContent='center'>
        <TabList className="mt-8">
          <Tab ><Title>Line Graph</Title></Tab>
          <Tab ><Title>Bar Graph</Title></Tab>
          

        </TabList>
        <TabPanels>

<TabPanel>
<LineChart width={1200} height={400} data={aggregateSales(salesCollection).monthlySales}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="monthlysales" stroke="#8884d8" strokeWidth={2} name="Montly Sales" />
  </LineChart>

</TabPanel>
<TabPanel>
<BarChart width={1200} height={400} data={aggregateSales(salesCollection).monthlySales}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="monthlysales" fill="#8884d8" name="Montly Sales" />
  </BarChart>

</TabPanel>
        </TabPanels>
        </TabGroup>
</Card>
                </Flex>
              </Flex>
            </div>
 </TabPanel>
          <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Flex className="space-x-2" justifyContent="center">
                
                <Card className='graph-card'>
                <TabGroup  justifyContent='center'>
        <TabList className="mt-8">
          <Tab ><Title>Area Graph</Title></Tab>
          <Tab ><Title>Line Graph</Title></Tab>
          

        </TabList>
        <TabPanels>

<TabPanel>
<AreaChart width={1200} height={400} data={salesCollection}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="billid" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="purchase" fill="#8884d8" stroke="#8884d8" name="Bill-Purchase" />
  </AreaChart>
</TabPanel>
<TabPanel>
<LineChart width={1200} height={400} data={salesCollection}>
    <XAxis dataKey="billid" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="purchase" stroke="#8884d8" strokeWidth={2} name="Bill-Purchase" />
  </LineChart>

</TabPanel>
        </TabPanels>
        </TabGroup>
</Card>
                </Flex>
              </Flex>
            </div>
            </TabPanel>




            <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4"> 
                <Flex className="space-x-2" justifyContent="center">
                <Card className='graph-card'>
  <LineChart width={1200} height={400} data={salesCollection}>
  <YAxis />

    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="totalsales" stroke="#8884d8" strokeWidth={2} name="Total Sales" />
  </LineChart>
</Card>
                </Flex>
              </Flex>
            </div>
          </TabPanel>
           
        </TabPanels>
      </TabGroup>

       
        </div>
      </>
    );
  }

}