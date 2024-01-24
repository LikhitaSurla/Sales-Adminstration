import React,{useState,useEffect} from 'react'
import { db } from '../config/firebase';
import {fetchSales} from '../FetchingData/Sales'
import { StatusOnlineIcon } from "@heroicons/react/outline";
import {Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,} from "@tremor/react";
import '../Styling/index.css'

export default function SalesData() {
  const[salesCollection,setSalesCollection]=useState([]);
  

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



{/* 
    <div>SalesData</div>
    {salesCollection.map((data) => (
            <div key={data.billid}>
                <h1>{data.billid}</h1>
                <h3>{data.name}</h3>
                <h3>{data.purchase}</h3>
                <h3>{data.totalsales}</h3>   
          </div> */}
       
    </>
  )
}
