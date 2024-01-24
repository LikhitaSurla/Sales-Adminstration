// import React from 'react'

// export default function CustomerReviews() {
//   return (
//     <>
//     <div>CustomerReviews</div>
//     How was your shopping experience with us today?
//     How would you rate the service you received from our staff?
//     Would you recommend our store to your friends or family?




//     </>
//   )
// }
// FormComponent.js

import React, { useState } from 'react';
import Rating from './Rating';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    // Other form fields...
    rating: 0,
  });

  const handleRatingChange = (value) => {
    setFormData({
      ...formData,
      rating: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission with formData
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields */}
      <div>
        <p>1. How was your shopping experience with us today?</p>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange} />
      </div>
      <div>
        <p>2.How would you rate the service you received from our staff?
</p>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange} />
      </div>
      <div>
        <p>3.Would you recommend our store to your friends or family?</p>
        <label htmlFor="rating">Rating:</label>
        <Rating onChange={handleRatingChange} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormComponent;
