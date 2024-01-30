
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import reviewData from '../FetchingData/Review';
import { Title } from '@tremor/react';

export default function CustomerReviews() {
  const [reviewCollection, setReviewCollection] = useState([]);

  const reviewDataset = async () => {
    try {
      const reviews = await reviewData();
      setReviewCollection(reviews);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    reviewDataset();
  }, []);

  const aggregateData = (questionNumber) => {
    const counts = {};

    for (let i = 1; i <= 5; i++) {
      counts[`${questionNumber}-${i}`] = 0;
    }

    reviewCollection.forEach((review) => {
      const option = review[`q${questionNumber}`];
      counts[`${questionNumber}-${option}`] += 1;
    });

    const aggregatedData = Object.keys(counts).map((key) => ({
      questionOption: key,
      count: counts[key],
    }));

    return aggregatedData;
  };

  return (
    <>
      <p>Customer Reviews</p>

    <div> <Title>1. How was your shopping experience with us today?</Title> {[1].map((questionNumber) => (
        <div key={questionNumber}>
          <BarChart width={800} height={400} data={aggregateData(questionNumber)}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="questionOption"  />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      ))}
      </div>


<br/>
<br/>
<br/>

      <div><Title>2.How would you rate the service you received from our staff?</Title>
      <br/>
<br/>
{[2].map((questionNumber) => (
        <div key={questionNumber}>
          <BarChart width={800} height={400} data={aggregateData(questionNumber)}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="questionOption" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      ))}
      </div>

      <br/>

<br/>
<br/>

      <div><Title>3.Would you recommend our store to your friends or family?</Title>
      <br/>
<br/>
{[3].map((questionNumber) => (
        <div key={questionNumber}>
          <BarChart width={800} height={400} data={aggregateData(questionNumber)}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="questionOption" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#d0ed57" />
          </BarChart>
        </div>
      ))}
      </div>
    </>
  );
}
