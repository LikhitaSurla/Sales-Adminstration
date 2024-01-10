import React,{useEffect, useState} from 'react';
import fetchProduct from '../FetchingData/ProductDetails';
import { collection,query,where,getDocs,doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Billing() {
  const productCollectionRef=collection(db,'productdetails')
  const [obj,setObj]=useState({});
  const [code,setCode]=useState('');
  const [quantity,setQuantity]=useState(1);

  const IncrementQuantity=()=>{
   setQuantity(quantity+1)
  }
  const DecrementQuantity=()=>{
    setQuantity(quantity-1)

  }
    useEffect(() => {
      const fetchData = async () => {
        try {
          const productData = await fetchProduct();
          // console.log('Fetched Product Data:', productData);

        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, []);
  
     const searchCode=async()=>{
        try {
          
          const q = query(productCollectionRef, where('code', '==', code));
          const product = await getDocs(q);
          const data = [];
          product.forEach((doc) => {
            data.push(doc.data());
          });
          setObj({
         productname:data[0].name,
         price:data[0].price

          })
        } catch (err) {
          console.log(err);
        }
      };
      useEffect(() => {
        console.log(obj);
      }, [obj]); 
      
     const newInput=()=>{
      `
      <input type="text" placeholder='code' onChange={(e)=>setCode(e.target.value)}/>
        <button onClick={searchCode}>Submit</button>
        <p>Product name:{obj.productname}</p>
        <p>Price:{obj.price}</p>
        <p>FinalPrice: {quantity*obj.price}</p>
          <div>
        <button onClick={DecrementQuantity}>-</button>
         <input type="number" placeholder='quantity' value={quantity}/>        
         <button onClick={IncrementQuantity}>+</button>
          </div>
          <button onClick={newInput} id='new'>New</button>`

     }

  return (
    <div>
      <section>
        <p>Customer Details</p>
        <input type="text" placeholder='Customer name'/>
        <input type="text" placeholder='Customer Number'/>

      </section>

      <section>
        <p>Items:</p>
        <input type="text" placeholder='code' onChange={(e)=>setCode(e.target.value)}/>
        <button onClick={searchCode}>Submit</button>
        <p>Product name:{obj.productname}</p>
        <p>Price:{obj.price}</p>
        <p>FinalPrice: {quantity*obj.price}</p>
          <div>
        <button onClick={DecrementQuantity}>-</button>
         <input type="number" placeholder='quantity' value={quantity}/>        
         <button onClick={IncrementQuantity}>+</button>
          </div>
          <button onClick={newInput} id='new'>New</button>
          

          
          </section>
        <button>Generate Bill</button>
      
    </div>
  )
}
