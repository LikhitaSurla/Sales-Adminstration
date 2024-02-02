

import React, { useState, useEffect } from 'react';
import { fetchSales } from '../FetchingData/Sales';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,BarChart, Bar, AreaChart, Area,} from 'recharts';
import '../Styling/index.css';
import {Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,Button,Metric,Flex,TabGroup,TabList,Tab,TabPanels,TabPanel,} from '@tremor/react';

import { PieChart, Pie, Cell, Legend as RechartsLegend } from 'recharts';

export default function SalesData() {
  const [salesCollection, setSalesCollection] = useState([]);
  const [viewSalesData, setViewSalesData] = useState(false);

  const salesDetails = async () => {
    try {
      const salesDb = await fetchSales();
      const sortedSales = salesDb.sort((a, b) => a.billid - b.billid);

      setSalesCollection(sortedSales);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    salesDetails();
  }, []);


  const viewData = () => {
    setViewSalesData(true);
  };
  // Update aggregateSales function
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666'];


  if (viewSalesData) {
    return (
      <>
        <Card>
    <Title>Sales Data</Title>
     <Table className="mt-4">
       <TableHead>
         <TableRow>
           <TableHeaderCell>BILL-ID</TableHeaderCell>
           <TableHeaderCell>DATE</TableHeaderCell>

           <TableHeaderCell>NAME</TableHeaderCell>
           <TableHeaderCell>PURCHASE</TableHeaderCell>
           <TableHeaderCell>TOTAL SALES</TableHeaderCell>
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
             <TableCell>
             {data.totalsales}
              
             </TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
   </Card>


      
      </>
    );
  } else {
    return (
      <>
        <Title style={{textAlign:'center'}}>Sales data</Title>

        <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">

          <Button size="xs" onClick={viewData}> View Data</Button></Flex>
      <div className='salescards'>

        <Card className="cards-container" decoration="top" decorationColor="indigo">
          <Title>Today Sales</Title>
        </Card>

        <Card className="cards-container" decoration="top" decorationColor="indigo">
          <Title>Monthly Sales</Title>
        </Card>
        <Card className="cards-container" decoration="top" decorationColor="indigo">
          <Title >Total Sales</Title>
        </Card>

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
    <Line type="monotone" dataKey="dailysales" stroke="#8884d8" name="Daily Purchases" />
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
    <Line type="monotone" dataKey="monthlysales" stroke="#8884d8" name="Montly Sales" />
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
    <Line type="monotone" dataKey="purchase" stroke="#8884d8" name="Bill-Purchase" />
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

