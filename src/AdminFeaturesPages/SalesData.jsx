

import React, { useState, useEffect } from 'react';
import { fetchSales } from '../FetchingData/Sales';
import {
  Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,Button,Metric,} from '@tremor/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../Styling/index.css';

export default function SalesData() {
  const [salesCollection, setSalesCollection] = useState([]);
  const [viewSalesData, setViewSalesData] = useState(false);

  const salesDetails = async () => {
    try {
      const salesDb = await fetchSales();
      const sortedSales = salesDb.sort((a, b) => {
        return new Date(a.year, a.month - 1, a.date) - new Date(b.year, b.month - 1, b.date);
      });
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
        <Title>Sales data</Title>
        <Button onClick={viewData}>View Data</Button>

        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
          <Title>Total Sales</Title>
        </Card>

        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
          <Title>Sales today</Title>
        </Card>
        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
          <Title>Monthly Sales</Title>
        </Card>

        
        <Card>
          <LineChart width={500} height={300} data={salesCollection}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="purchase" stroke="#8884d8" />
          </LineChart>
        </Card>
      </>
    );
  }
}

