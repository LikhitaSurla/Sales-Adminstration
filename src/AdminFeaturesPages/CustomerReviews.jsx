
import React,{useState,useEffect} from 'react'
import { Card, SparkAreaChart, SparkBarChart, SparkLineChart, Text, Title } from "@tremor/react";
import reviewData from '../FetchingData/Review';

export default function CustomerReviews() {

 
  const[reviewCollection,setReviewCollection]=useState([
    { month: "Jan 21", q1: 4, q2: 3, q3: 5 },
  { month: "Feb 21", q1: 3, q2: 4, q3: 2 },
  ])
  const reviewDataset=async()=>{
    try{
      const reviewDb=await reviewData();
      setReviewCollection(reviewDb)
      console.log(reviewDb)
    }catch(err){
      console.error(err)
    }
  }
  useEffect(()=>{
    reviewDataset();
},[])

  return (
    // <div>CustomerReviews</div>
    <>
    <p>hii</p>
    
    <Card className="mx-auto w-fit">
    <SparkAreaChart
      data={reviewCollection}
      categories={["q2"]}
      index={"month"}
      colors={["indigo-200", "#ffcc33"]}
      className="h-10 w-36"
    />
  </Card>
    </>
  )
}




















// import { Card, SparkAreaChart, SparkBarChart, SparkLineChart, Text, Title } from "@tremor/react";

// export const chartdata = [
//   { month: "Jan 21", q1: 4, q2: 3, q3: 5 },
//   { month: "Feb 21", q1: 3, q2: 4, q3: 2 },
// ];

// export default function SparkAreaExample() {
//   return (
    // <Card className="mx-auto w-fit">
    // <SparkAreaChart
    //   data={chartdata}
    //   categories={["q1"]}
    //   index={"month"}
    //   colors={["indigo-200", "#ffcc33"]}
    //   className="h-10 w-36"
  //   />
  // </Card>
//   );
// }
