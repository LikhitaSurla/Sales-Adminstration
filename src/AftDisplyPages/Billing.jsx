import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs,addDoc,updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Billing(props) {

  const productCollectionRef = collection(db, 'productdetails');
  const customerCollectionRef = collection(db, 'customers');
  const employeeCollectionRef =collection(db,'employeedata')
  const salesCollectionRef = collection(db, 'salesdata');


  const [items, setItems] = useState([]);
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const[customerName,setCustomerName]=useState('');
  const[customerNumber,setCustomerNumber]=useState('');
  const[payment,setPayment]=useState(false);
  const[billNo,setBillNo]=useState(12300000)
  const [totalSales,setTotalSales]=useState(0);

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
    const totalPrice = quantity * obj.price;
    setFinalPrice((prevFinalPrice) => prevFinalPrice + totalPrice);
    const newItem = { ...obj, quantity, totalPrice, id: Date.now() };
    setItems((prevItems) => [...prevItems, newItem]);

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


const paymentSuccess=()=>{
    setPayment(false);
    setCustomerName('');
    setCustomerNumber('');

 setTotalSales(totalSales+finalPrice); 
    setItems([]);
    setFinalPrice(0);
    handleUpdateButton();
    setBillNo(billNo+1)


try{
  addDoc(customerCollectionRef,{
    name:customerName, phonenumber:customerNumber
  })

  addDoc(salesCollectionRef,{
    name:customerName,purchase:finalPrice,billid:billNo,totalsales:totalSales+finalPrice
  })

}catch(err){
  console.error(err)
}
  }

  const deleteItem = (itemId,itemPrice,itemQuantity) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setFinalPrice(finalPrice-(itemPrice*itemQuantity))
  };

  const generateBill=()=>{
    setPayment(true);
  }


  const handleUpdateButton=async()=>{
    
    try {
        const querySnapshot = await getDocs(
            query(collection(db, 'employeedata'), where('empid', '==',props.empId ))
        );
        const data = [];
        if (querySnapshot.docs.length > 0) {
          const q = query(employeeCollectionRef, where('empid', '==',props.empId ));
          const userCredentials = await getDocs(q);
          userCredentials.forEach((doc) => {
            data.push(doc.data());
          });
          let Bonus=finalPrice*0.05

            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef,{
            bonus:data[0].bonus + Bonus
            });
            
            
        } else {
            console.error(`Document with empid ${id} not found.`);
        }
    } catch (err) {
        console.log(err);
    }
}

  return (
    <div>
      <p>EmployeeId:{props.empId}</p>
      <section>
        <p>Customer details</p>
        <input type="text" placeholder="Customer Name" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} required/>
        <input type="text" placeholder="Customer Number" value={customerNumber} onChange={(e)=>setCustomerNumber(e.target.value)} required/>
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
            <li key={item.id}>
              {item.productname} - {item.price*item.quantity} - Quantity: {item.quantity}
              <button onClick={() => deleteItem(item.id,item.price,item.quantity)}>Delete</button>

            </li>

          ))}
      </section>
      <p>To Pay:{finalPrice}</p>
      {
        finalPrice>0?<button onClick={generateBill}>Generate Bill</button>
        :<p>No products to bill on list</p>
      }
      
      {payment && <button onClick={paymentSuccess}>Payment Succesful</button>  }
    </div>
  );
}
