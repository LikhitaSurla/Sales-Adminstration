import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const reviewData = async () => {
  try {
    const reviewCollectionRef = collection(db, 'review');
    const reviewValues = await getDocs(reviewCollectionRef);
    const data = [];
    reviewValues.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw error;
  }
};

export default reviewData;