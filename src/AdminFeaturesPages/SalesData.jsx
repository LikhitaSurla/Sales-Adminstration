

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
  const aggregateSales = (salesDb) => {
    const aggregatedData = salesDb.reduce((acc, data) => {
      const key = `${data.year}-${data.month}-${data.date}`;
      if (!acc[key]) {
        acc[key] = { ...data, totalsales: data.totalsales, totalpurchase: data.purchase };
      } else {
        acc[key].totalsales += data.totalsales;
        acc[key].totalpurchase += data.purchase;
      }
      return acc;
    }, {});
  
    return Object.values(aggregatedData);
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
          <Title>Sales today</Title>
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
          <Tab ><Title>Customer Distribution</Title></Tab>
          <Tab ><Title>Cumulative Sales</Title></Tab>

        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Flex className="space-x-2" justifyContent="center">
                <Card>
  <BarChart width={500} height={300} data={salesCollection}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="totalsales" fill="#8884d8" />
  </BarChart>
</Card>

                </Flex>
              </Flex>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Flex className="space-x-2" justifyContent="center">
                <Card>
  <LineChart width={500} height={300} data={salesCollection}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="purchase" stroke="#8884d8" name="Daily Purchases" />
    <Line type="monotone" dataKey="totalsales" stroke="#82ca9d" name="Total Sales" />
  </LineChart>
</Card>
                </Flex>
              </Flex>
            </div>
          </TabPanel>
          
          <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Flex className="space-x-2" justifyContent="center">
                <Card>
  <PieChart width={400} height={400}>
    <Pie data={salesCollection} dataKey="purchase" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
      {salesCollection.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <RechartsLegend />
  </PieChart>
</Card>
                </Flex>
              </Flex>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="mt-10">
              <Flex className="mt-4">
                <Flex className="space-x-2" justifyContent="center">
                <Card>
  <AreaChart width={500} height={300} data={salesCollection}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="billid" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="purchase" fill="#8884d8" stroke="#8884d8" />
  </AreaChart>
</Card>
                </Flex>
              </Flex>
            </div>
          </TabPanel>

      
        </TabPanels>
      </TabGroup>

        {/* <Card>
          <LineChart width={500} height={300} data={salesCollection}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="purchase" stroke="#8884d8" />
          </LineChart>
        </Card> */}
        </div>
      </>
    );
  }
}

