
import React, { useState } from 'react';
import Rating from './Rating';
import { db } from '../config/firebase';
import { addDoc, collection } from '@firebase/firestore';
const reviewCollectionRef = collection(db,'review');

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
    <form onSubmit={handleSubmit}>
      <div>
        <p>1. How was your shopping experience with us today?</p>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange1} />
      </div>
      <div>
        <p>2.How would you rate the service you received from our staff?
</p>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange2} />   
      </div>
      <div>
        <p>3.Would you recommend our store to your friends or family?</p>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange3} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormComponent;
