import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { indexValues } from '../FetchingData/Sales'
import { SearchIcon } from "@heroicons/react/solid";
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Title, Grid, Col, Flex } from "@tremor/react";
import '../Styling/index.css'
import custDetails from '../FetchingData/Customers'
import { useNavigate } from 'react-router-dom';


export default function Billing(props) {

  const productCollectionRef = collection(db, 'productdetails');
  const customerCollectionRef = collection(db, 'customers');
  const employeeCollectionRef = collection(db, 'employeedata')
  const salesCollectionRef = collection(db, 'salesdata');
  const indexCollectionRef = collection(db, 'indexes')
  const documentId = 'WH23CKiI1e0rKiGaKz4R';
  const indexDocumentRef = doc(indexCollectionRef, documentId);
  const navigate = useNavigate();
  const[customerCollection,setCustomerCollection]=useState([]);
  const [items, setItems] = useState([]);
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [payment, setPayment] = useState(false);
  const [state, setState] = useState(true);
  const [empId, setEmpId] = useState('');
  const [billNo, setBillNo] = useState(0)
  const [totalSales, setTotalSales] = useState(0);
  const [isValid, setIsValid] = useState(true);
 const[monthlySales,setMonthlySales]=useState(0);
  const[dailySales,setDailySales]=useState(0);
  const [currDate, setCurrDate] = useState('');
const[currMonth,setCurrMonth]=useState('');


  const [newCustomersCount,setNewCustomersCount] = useState(0);

  const indexDetails = async () => {
    try {
      const indexDb = await indexValues();
      const customerDB = await custDetails();
      setCustomerCollection(customerDB);
      indexDb.map((data) => {
        setBillNo(data.billid);
        setTotalSales(data.totalsales);
        setDailySales(data.dailysales);
        setCurrDate(data.currDate); 
         setMonthlySales(data.monthlysales);
         setCurrMonth(data.currMonth);
        setNewCustomersCount(data.newcustomers);
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    indexDetails();
  }, [])


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

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  let currentMonth=`${month}-${year}`;
  const paymentSuccess = async () => {
    let count = 0;
    customerCollection.map((data)=>{
      if(data.phonenumber==customerNumber){
        count = count+1;
      }
    })
    if(count==0){
      try{
      await updateDoc(indexDocumentRef,{
        newcustomers:newCustomersCount+1
      })
      console.log('Data updated')
    }
    catch{
      console.log('error')
    }
    }
    setPayment(false);
    setCustomerName('');
    setCustomerNumber('');
    setTotalSales(totalSales + finalPrice);
    if (currentDate === currDate) {
      setDailySales(dailySales + finalPrice);
    } else {
      setDailySales(finalPrice);
      setCurrDate(`${day}-${month}-${year}`);
    }
if(currentMonth === currMonth)  {
  setMonthlySales(monthlySales+finalPrice);
} else{
setMonthlySales(finalPrice);
setCurrMonth(`${month}-${year}`)
}
 setItems([]);
    setFinalPrice(0);
    handleUpdateButton();
    setBillNo(billNo + 1)
    try {
      let val = true;
      const details = await getDocs(customerCollectionRef);
      details.forEach((doc) => {
        if (doc.data().phonenumber == customerNumber) {
          val = false;
        }
      })
      if (val) {
        addDoc(customerCollectionRef, {
          name: customerName, phonenumber: customerNumber
        })
      }
      addDoc(salesCollectionRef, {
        name: customerName, purchase: finalPrice, billid: billNo + 1, totalsales: totalSales + finalPrice,date:day,month:month,year:year,
        dailysales:dailySales+finalPrice,monthlysales:monthlySales+finalPrice
      })

      updateDoc(indexDocumentRef, {
        billid: billNo + 1,
        totalsales: totalSales + finalPrice,
        dailysales:dailySales+finalPrice,
        currDate: `${day}-${month}-${year}`,
        monthlysales:monthlySales+finalPrice,
        currMonth:`${month}-${year}`
      })


      

    } catch (err) {
      console.error(err)
    }
    setChangePage(true)
    setBillPage(false)
  }

  const deleteItem = (itemId, itemPrice, itemQuantity) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setFinalPrice(finalPrice - (itemPrice * itemQuantity))
  };

  const generateBill = () => {
    if(customerNumber.length!=10){
      alert("Re-Verify Phone Numnber")
    }
    else if(customerName == '' ){
      alert("Customer Name Can't Be Empty")
    }
    else {
      setPayment(true);
    }
  }


  const handleUpdateButton = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'employeedata'), where('empid', '==', empId))
      );
      const data = [];
      if (querySnapshot.docs.length > 0) {
        const q = query(employeeCollectionRef, where('empid', '==', empId));
        const userCredentials = await getDocs(q);
        userCredentials.forEach((doc) => {
          data.push(doc.data());
        });
        let Bonus = parseFloat((finalPrice * 0.05).toFixed(2));
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          bonus: data[0].bonus + Bonus
        });


      } else {
        console.error(`Document with empid ${id} not found.`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const [changePage, setChangePage] = useState(false);
  const [billPage, setBillPage] = useState(false);

  const idSubmit = async (e) => {
    let dummy = false;
    e.preventDefault();
    const empData = await getDocs(employeeCollectionRef);
    empData.forEach((doc) => {
      if (empId != doc.data().empid){
        setIsValid(false)
        setTimeout(()=>{
          setIsValid(true);
        },1000)
      }
      else {
        setBillPage(true)
        setState(false)
      }
    })
  }
  if (state) {
    return (
      <div className='employesubmit'>
        <form onSubmit={idSubmit}>
          <Card className="max-w-sm mx-auto">
            <p> Employee Id :<span>  </span>
              <input type="text" placeholder='service id' onChange={(e) => setEmpId(e.target.value)} required /></p>
            <Flex justifycontent="center" className="space-x-2 border-t pt-4 mt-8">
              <Button size="xs" type='submit' variant="primary">
                Submit </Button>
            </Flex>
              {!isValid && <div style={{textAlign:'center'}}>Wrong Details</div>}
          </Card>
        </form>
      </div>
    )
  }
  else if (billPage) {
    return (<>
      <h1 style={{ textAlign: 'center', marginBottom: '-48px', marginTop: '8px' }}>Billing Page</h1>
      <div className='billing'>
        <Grid numItemsLg={6} className="gap-6 mt-6">
          <Col numColSpanLg={2} className='billing-side-a'>
            <div className="space-y-6">
              <Card>
                <div>EmployeeId: <b> {empId}</b></div>
                <br />
                <div >Date: <b>{currentDate}</b></div>
                <br />
                <div >Bill No: <b>{billNo}</b></div>
              </Card>
            </div>
            <div className="space-y-6" >
              <Card>


                <p>Customer Name:
                  <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                </p>
                <br />
                <p>
                  Customer Number: <input type="text" placeholder="Customer Number" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} required />
                </p>
              </Card>
            </div>

            <div className="space-y-6" >
              <Card>
                <h1>To Pay:{finalPrice}</h1>
                <Flex justifycontent="center" className="space-x-2 border-t pt-4 mt-8">
                  {
                    finalPrice > 0 ? <Button justifycontent="center" size="xs" onClick={generateBill}>Generate Bill</Button>
                      : <p>No products to bill on list</p>
                  }
                </Flex>
                <Flex justifycontent="center" className="space-x-2 border-t pt-4 mt-8">

                  {payment && <Button size="xs" onClick={paymentSuccess}>Payment Succesful</Button>}
                </Flex>

              </Card>
            </div>


          </Col>

          <Col numColSpanLg={4}>
            <div className="space-y-6" >
              <Card className="h-full">
                <p>Search Product Code :<span> </span>
                  <input icon={SearchIcon} placeholder="Search for Product Code..."
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)} required /><span>  </span>
                  <Button size="xs" onClick={searchCode}>Submit</Button></p>

                <p>Product name: {obj.productname}</p>
                <br />
                <p>Price: {obj.price}</p>
                <br />
                <p>Quantity:
                  <span> </span>
                  <Button size="xs" onClick={DecrementQuantity}>-</Button><span>  </span>
                  <input style={{ textAlign: "center" }}
                    type="number"
                    placeholder="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  /><span>  </span>
                  <Button size="xs" onClick={IncrementQuantity}>+</Button>
                </p>
                <p style={{ marginBottom: '10px' }}>Final Price: {quantity * obj.price}</p>

                <Button size="xs" onClick={doneBtn}>
                  Done
                </Button>

                <section>


                  <Table className="mt-5">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>PRODUCT ID</TableHeaderCell>
                        <TableHeaderCell>PRODUCT NAME</TableHeaderCell>
                        <TableHeaderCell>PRICE</TableHeaderCell>
                        <TableHeaderCell>QUANTITY</TableHeaderCell>
                        <TableHeaderCell>TOTAL PRICE</TableHeaderCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            <Text>{item.productname}</Text>
                          </TableCell>
                          <TableCell>
                            <Text>{item.price}</Text>
                          </TableCell>
                          <TableCell>
                            <Text>{item.quantity}</Text>
                          </TableCell>
                          <TableCell>
                            <Text>{item.price * item.quantity}</Text>
                          </TableCell>
                          <TableCell>
                            <Button size="xs" onClick={() => deleteItem(item.id, item.price, item.quantity)}>Delete</Button>

                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>


                </section>
              </Card>
            </div>
          </Col>
        </Grid>

      </div>
    </>
    );
  }
  else if (changePage == true && billPage == false) {
    return (
navigate('/display')    )
  }
}
