
import React, { useState } from 'react';
import Rating from './Rating';
import { db } from '../config/firebase';
import { addDoc, collection } from '@firebase/firestore';
const reviewCollectionRef = collection(db,'review');
import { Button,Card,Title } from "@tremor/react";

const FormComponent = () => {
    const [question1,setQuestion1] = useState(0)
    const [question2,setQuestion2] = useState(0)
    const [question3,setQuestion3] = useState(0)

  const handleRatingChange1 = (value) => {
   setQuestion1(value)
  };
  const handleRatingChange2 = (value) => {
   setQuestion2(value)
  };
  const handleRatingChange3 = (value) => {
   setQuestion3(value)
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    alert("form submitted")
    addDoc(reviewCollectionRef,{
        q1:question1,
        q2:question2,
        q3:question3
    })
  };

  return (
    <>
    <div className='reviewques'>
    <Card className='reviewquescard'>
    <form onSubmit={handleSubmit}>
      <Title style={{textAlign:'center'}}>Review Form</Title>
      <div style={{padding:'20px'}}>
        <h3 style={{fontSize:'15px'}}>1. How was your shopping experience with us today?</h3>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange1} />
      </div>
      <div>
        <h3>2.How would you rate the service you received from our staff?
</h3>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange2} />   
      </div>
      <div>
        <h3>3.Would you recommend our store to your friends or family?</h3>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange3} />
      </div>

      <Button type="submit">Submit</Button>
    </form>
   </Card>
   </div>
   </>
  );
};

export default FormComponent;
