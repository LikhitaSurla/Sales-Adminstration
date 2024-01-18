import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const custDetails = async () => {
    try {
        const customerDetailsRef = collection(db, 'customers');
        const customerDetails = await getDocs(customerDetailsRef);
        const data = [];
        customerDetails.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw error;
  }
};

export default custDetails;
