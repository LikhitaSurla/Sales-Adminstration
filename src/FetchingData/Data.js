import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchData = async () => {
  try {
    const userCollectionRef = collection(db, 'userdata');
    const userCredentials = await getDocs(userCollectionRef);
    const data = [];
    userCredentials.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw error;
  }
};

export default fetchData;
