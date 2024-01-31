import React,{useState,useEffect} from 'react'
import {fetchSales} from '../FetchingData/Sales'
import {Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,Button,Metric} from "@tremor/react";
import '../Styling/index.css'

export default function SalesData() {
  const[salesCollection,setSalesCollection]=useState([]);
  const[viewSalesData,setViewSalesData]=useState(false);

  const salesDetails=async()=>{
    try{
      const salesDb=await fetchSales();
       setSalesCollection(salesDb)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    salesDetails();
  },[]) 

  const viewData=()=>{
    setViewSalesData(true)
  }
  if(viewSalesData){
  return (
    <>
    <Card>
    <Title>Sales Data</Title>
    <Table className="mt-4">
      <TableHead>
        <TableRow>
          <TableHeaderCell>BILL-ID</TableHeaderCell>
          <TableHeaderCell>NAME</TableHeaderCell>
          <TableHeaderCell>PURCHASE</TableHeaderCell>
          <TableHeaderCell>TOTAL SALES</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {salesCollection.map((data) => (
          <TableRow key={data.billid}>
            <TableCell>{data.billid}</TableCell>
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
  )
}else{
  return(
    <>
    <Title>Sales data</Title>
    <Button onClick={viewData}>View Data</Button>
   

  <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo" >
    <Title>Total Sales</Title>
  </Card>

  <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo" >
    <Title>Sales today</Title>
  </Card>
  <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo" >
    <Title>Monthly Sales</Title>
  </Card>

    </>
  )
}
}
