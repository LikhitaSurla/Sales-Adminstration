import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Billing() {
  const productCollectionRef = collection(db, 'productdetails');
  const [items, setItems] = useState([]);
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [prevQuantity, setPrevQuantity] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // There are small small errors the error is the items are diplaying but when we try to increse
  //the quantityt of second item the first items quantity and value is also changing check it out
  const [obj, setObj] = useState({
    productname: 'None',
    price: 0,
  });

  const IncrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const DecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const newInput = () => {
    setCode('');
    setQuantity(1);
    setObj({
      productname: 'None',
      price: 0,
    });
  };

  const doneBtn = () => {
    setFinalPrice(quantity*obj.price)
    setPrevQuantity(quantity);
    setItems((prevItems) => [...prevItems, obj]);
    newInput();
  };

  const searchCode = async () => {
    try {
      const q = query(productCollectionRef, where('code', '==', code));
      const product = await getDocs(q);
      const data = [];
      product.forEach((doc) => {
        data.push(doc.data());
      });
      setObj({
        productname: data[0].name,
        price: data[0].price,
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
  }, [obj]);

  return (
    <div>
      <section>
        <p>Customer details</p>
        <input type="text" placeholder="Customer name" />
        <input type="text" placeholder="Customer Number" />
      </section>
      <section>
        <p>Items:</p>
        <input
          type="text"
          placeholder="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={searchCode}>Submit</button>
        <p>Product name: {obj.productname}</p>
        <p>Price: {obj.price}</p>
        <p>Final Price: {quantity * obj.price}</p>
        <div>
          <button onClick={DecrementQuantity}>-</button>
          <input
            type="number"
            placeholder="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button onClick={IncrementQuantity}>+</button>
        </div>
        <br />
        <br />
      </section>
      <div>
        <button onClick={doneBtn}>
          Done
        </button>
      </div>
      <br />
      <section>
        <p>Selected Items:</p>
          {items.map((item, index) => (
            <li >
              {item.productname} - {finalPrice} - Quantity: {prevQuantity}
            </li>
          ))}
      </section>
    </div>
  );
}
