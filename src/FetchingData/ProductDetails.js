import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchProduct = async () => {
    try {
        const productCollectionRef = collection(db, 'productdetails');
        const productDetails = await getDocs(productCollectionRef);
        const data = [];
        productDetails.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw error;
  }
};

export default fetchProduct;
