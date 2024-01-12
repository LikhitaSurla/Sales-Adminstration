import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchSales = async () => {
    try {
        const salesCollectionRef = collection(db, 'salesdata');
        const salesDetails = await getDocs(salesCollectionRef);
        const data = [];
        salesDetails.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw error;
  }
};

export default fetchSales;
