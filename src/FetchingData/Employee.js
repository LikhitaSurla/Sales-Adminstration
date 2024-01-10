import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const employeeData = async () => {
  try {
    const userCollectionRef = collection(db, 'employeedata');
    const userCredentials = await getDocs(userCollectionRef);
    const data = [];
    userCredentials.forEach((doc) => {
      data.push(doc.data());
      // console.log(data)
    });
    return data;
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw error;
  }
};

export default employeeData;