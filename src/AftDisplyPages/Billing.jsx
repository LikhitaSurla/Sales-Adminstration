import React, { useEffect, useState } from "react";
import {Tooltip }from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { indexValues } from "../FetchingData/Sales";
import {Button,Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,Grid,Col,Flex,} from "@tremor/react";
import "../Styling/index.css";
import custDetails from "../FetchingData/Customers";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import {IoClose,FaUserFriends,MdOutlinePhoneInTalk,MdOutlineReceiptLong} from '../exp/reacticons'

export default function Billing() {
  const productCollectionRef = collection(db, "productdetails");
  const customerCollectionRef = collection(db, "customers");
  const employeeCollectionRef = collection(db, "employeedata");
  const salesCollectionRef = collection(db, "salesdata");
  const indexCollectionRef = collection(db, "indexes");
  const documentId = "WH23CKiI1e0rKiGaKz4R";
  const indexDocumentRef = doc(indexCollectionRef, documentId);
  const navigate = useNavigate();
  const [customerCollection, setCustomerCollection] = useState([]);
  const [items, setItems] = useState([]);
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [payment, setPayment] = useState(false);
  const [state, setState] = useState(true);
  const [empId, setEmpId] = useState("");
  const [billNo, setBillNo] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const [monthlySales, setMonthlySales] = useState(0);
  const [dailySales, setDailySales] = useState(0);
  const [currDate, setCurrDate] = useState("");
  const [currMonth, setCurrMonth] = useState("");
  const [hasSessionData, setHasSessionData] = useState(false);
  const [newCustomersCount, setNewCustomersCount] = useState(0);


  useEffect(() => {
    const alertTimeout = setTimeout(() => {
        alert("Some of the few Employee IDs of this company are between: \n VLE0001 - VLE0010 \n VLE0011 - VLE0020 \n \n For product codes, explore within following : \n For Men : VLM001 - VLM010 \n For Women : VLW001 -VLW010");
      
    }, 500); 
    
     
    return () => clearTimeout(alertTimeout);

}, []);

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
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkSessionData = async () => {
      const dataInSession = sessionStorage.getItem("User");
      if (!dataInSession) {
        navigate("/");
      } else {
        setHasSessionData(true);
      }
    };
    checkSessionData();
    indexDetails();
  }, []);

  const [obj, setObj] = useState({
    productname: "None",
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
    setCode("");
    setQuantity(1);
    setObj({
      productname: "None",
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
  let itemCode;
  
  const searchCode = async (e) => {
    e.preventDefault();
    itemCode = code.toUpperCase();
    
    try {
      
      const q = query(productCollectionRef, where("code", "==", itemCode));
      const product = await getDocs(q);
      const data = [];
      product.forEach((doc) => {
        data.push(doc.data());
      });
     
      if (data.length === 0) {
       
        alert('Product Code not found..!! Please re-check \n  \n For product codes, explore within following : \n For Men : VLM001 - VLM010 \n For Women : VLW001 -VLW010')
      } else {
        setObj({
          productname: data[0].name,
          price: data[0].price,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {}, [obj]);

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  let currentMonth = `${month}-${year}`;


  const paymentSuccess = async () => {
    let count = 0;
    customerCollection.map((data) => {
      if (data.phonenumber == customerNumber) {
        count = count + 1;
      }
    });
    if (count == 0) {
      try {
        await updateDoc(indexDocumentRef, {
          newcustomers: newCustomersCount + 1,
        });
      } catch {
        console.log("error");
      }
    }
    setPayment(false);
    setCustomerName("");
    setCustomerNumber("");
    setTotalSales(totalSales + finalPrice);
    if (currentDate === currDate) {
      setDailySales(dailySales + finalPrice);
    } else {
      setDailySales(finalPrice);
      setCurrDate(`${day}-${month}-${year}`);
    }
    if (currentMonth === currMonth) {
      setMonthlySales(monthlySales + finalPrice);
    } else {
      setMonthlySales(finalPrice);
      setCurrMonth(`${month}-${year}`);
    }
    setItems([]);
    setFinalPrice(0);
    handleUpdateButton();
    setBillNo(billNo + 1);
    try {
      let val = true;
      const details = await getDocs(customerCollectionRef);
      details.forEach((doc) => {
        if (doc.data().phonenumber == customerNumber) {
          val = false;
        }
      });
      if (val) {
        addDoc(customerCollectionRef, {
          name: customerName,
          phonenumber: customerNumber,
        });
      }
      addDoc(salesCollectionRef, {
        name: customerName,
        purchase: finalPrice,
        billid: billNo + 1,
        totalsales: totalSales + finalPrice,
        date: day,
        month: month,
        year: year,
        dailysales: dailySales + finalPrice,
        monthlysales: monthlySales + finalPrice,
      });

      updateDoc(indexDocumentRef, {
        billid: billNo + 1,
        totalsales: totalSales + finalPrice,
        dailysales: dailySales + finalPrice,
        currDate: `${day}-${month}-${year}`,
        monthlysales: monthlySales + finalPrice,
        currMonth: `${month}-${year}`,
      });
    } catch (err) {
      console.error(err);
    }
    setChangePage(true);
    setBillPage(false);
  };

  const deleteItem = (itemId, itemPrice, itemQuantity) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setFinalPrice(finalPrice - itemPrice * itemQuantity);
    if (finalPrice - itemPrice == 0) {
      setPayment(false);
    }
  };

  const generateBill = () => {

    if(customerName=='' && customerNumber==''){
      alert('Enter Customer Details')
    }
    else if(customerName=='' && customerNumber.length!=10){
      alert("Enter Customer Details Properly")
    }
    else if (customerNumber.length != 10) {
      alert("Re-Verify Phone Numnber");
    } else if (customerName == "") {
      alert("Customer Name Can't Be Empty");
    } else {
      setPayment(true);
    }
  };

  const handleUpdateButton = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "employeedata"), where("empid", "==", empId))
      );
      const data = [];
      if (querySnapshot.docs.length > 0) {
        const q = query(employeeCollectionRef, where("empid", "==", empId));
        const userCredentials = await getDocs(q);
        userCredentials.forEach((doc) => {
          data.push(doc.data());
        });
        let Bonus = parseFloat((finalPrice * 0.05).toFixed(2));
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          bonus: data[0].bonus + Bonus,
        });
      } else {
        console.error(`Document with empid ${id} not found.`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [changePage, setChangePage] = useState(false);
  const [billPage, setBillPage] = useState(false);

  const idSubmit = async (e) => {
    e.preventDefault();
    const empData = await getDocs(employeeCollectionRef);
    const empNumber = empId.toUpperCase();
    setEmpId(empNumber)
    empData.forEach((doc) => {
      if (empNumber != doc.data().empid) {
        setIsValid(false);
        setTimeout(() => {
          setIsValid(true);
        }, 1000);
      } else {
        setBillPage(true);
        setState(false);
      }
    });
  };
  const goToDisplay= ()=>{
    navigate('/display')
  }
  if (state && hasSessionData) {
    return (
      <div className = "employesubmit">
        <form onSubmit={idSubmit}>
          <Card className="max-w-sm mx-auto" style={{boxShadow:'-1px 2px 14px -1px rgba(0,0,0,0.34)'}}>
            <div style={{textAlign:'center',marginBottom:'18px',fontFamily:'arial',fontWeight:500}}>EMPLOYEE DETAILS</div>
            <p>
              
               <TextField
                      style={{ width: "337px",marginBottom:-15}}
                      id="outlined-basic"
                      label="Enter Employee ID"
                      variant="outlined"
                      onChange={(e) => setEmpId(e.target.value)}
                      InputLabelProps={{ style: { height: 20} }}
                      inputProps={{ style: { height:18} }}
                      required
                    />
            </p>
            <Flex
              justifycontent="center"
              className="space-x-2 border-t pt-4 mt-8"
            >
              <Button size="xs" type="submit" variant="primary">
                Submit{" "}
              </Button>
            </Flex>
            {!isValid && (
              <div style={{ textAlign: "center",marginTop:5 }}> <p style={{color:'red',fontWeight:400}}>Invalid Employee Id</p></div>
            )}
          </Card>
        </form>
      </div>
    );
  } else if (billPage && hasSessionData ) {
    return (
      <>
     
        <Title
          style={{
            textAlign: "center",
            height: "64px",
            color: "#CBB306  ",
            display: "flex",
            justifyContent: "center",
            marginBottom: "-39px",
            backgroundColor: "#02124D",
          }}
        >
        
          <p style={{textAlign:'center', marginTop: "20px", color:'white ', fontFamily: "Poppins" }}>
            BILLING
            <MdOutlineReceiptLong
            size={24}
              style={{
                textAlign:'center',
                color: "#A69A03",
                float: "right",
                marginLeft: "8px",
                marginTop: "2px",
              }}
            />
          </p>
        </Title>
          <Tooltip title='Exit' style={{float:'right'}}>
            <button className='backToFeaturesEmp' onClick={goToDisplay}>
              <IoClose size={20} style={{marginLeft:"5",
              marginTop:"-1px"}}/>
            </button>
          </Tooltip>
      
        <div className="billing" style={{ marginRight: "10px" }}>
          <Grid numItemsLg={6} className="gap-6 mt-6">
            <Col numColSpanLg={2} className="billing-side-a">
              <div className="space-y-6">
                <Card
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#F0F0F0 ",
                    marginBottom: "-5px",
                    height:"200px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    EmployeeId: <b>{empId}</b>
                  </div>
                  <br />
                  <div style={{ textAlign: "center" }}>
                    Date: <b>{currentDate}</b>
                  </div>
                  <br />
                  <div style={{ textAlign: "center" }}>
                    Bill No: <b>{billNo}</b>
                  </div>
                </Card>
              </div>
              <div className="space-y-6">
                <Card
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#F0F0F0 ",
                    marginBottom: "-5px",
                  }}
                >
                  <div className="formsordering">
                    <FaUserFriends
                      size={20}
                      style={{
                        marginTop: "14px",
                        marginLeft: "10px",
                        marginRight: "10px",
                      }}
                    />{" "}
                    <TextField
                      style={{ width: "300px"}}
                      id="outlined-basic"
                      label="Enter Customer Name"
                      variant="outlined"
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      InputLabelProps={{ style: { height: 25 } }}
                      inputProps={{ style: { height: 20 } }}
                    />
                  </div>

                  <div className="formsordering">
                    <MdOutlinePhoneInTalk
                      size={22}
                      style={{
                        marginTop: "14px",
                        marginLeft: "10px",
                        marginRight: "10px",
                      }}
                    />
                    <TextField
                      style={{ width: "300px"}}
                      type="text"
                      id="outlined-basic"
                      label="Enter Customer Number"
                      variant="outlined"
                      onChange={(e) => setCustomerNumber(e.target.value)}
                      required
                      inputProps={{ style: { height: 20 } }}
                    />
                  </div>
                  
                </Card>
              </div>

              <div className="space-y-6">
                <Card
                  style={{ marginLeft: "10px", backgroundColor: "#F0F0F0 " }}
                >
                  <h1 style={{ marginBottom: "-30px" }}>
                    To Pay: {"\u20B9"}
                    {finalPrice}.00
                  </h1>
                  <Flex
                    justifycontent="center"
                    className="space-x-2 border-t pt-4 mt-8"
                  >
                    {finalPrice > 0 ? (
                      <Button
                        style={{ marginBottom: "-15px" }}
                        justifycontent="center"
                        size="xs"
                        onClick={generateBill}
                      >
                        Generate Bill
                      </Button>
                    ) : (
                      <p style={{ marginBottom: "-10px" }}>
                        No products added to your Bill
                      </p>
                    )}
                  </Flex>
                  <Flex
                    justifycontent="center"
                    className="space-x-2 border-t pt-4 mt-8"
                  >
                    {payment && finalPrice > 0 && (
                      <Button
                        style={{
                          marginBottom: "-10px",
                          backgroundColor: "green",
                          border:'none'
                        }}
                        size="xs"
                        onClick={paymentSuccess}
                      >
                        Payment Succesful
                      </Button>
                    )}
                  </Flex>
                </Card>
              </div>
            </Col>

            <Col numColSpanLg={4}>
              <div className="space-y-6">
                <Card
                  className="h-full"
                  style={{ marginRight: "20px", backgroundColor: "#F0F0F0 " }}
                >
                  <p style={{ fontWeight: "500" }}>
                    <form onSubmit={searchCode} style={{display:'flex'}}>
                    Search Product Code :<span> </span>
                    <input style={{marginTop:-7,marginLeft:8}}
                      placeholder="Search for Product Code..."
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                    <span> </span>
                    <Button size="xs" type="submit" style={{marginLeft:8,height:35,marginTop:-4}} >
                      Submit
                    </Button>
                    </form>
                  </p>

                  <div style={{display:'flex'}}>

                    <div style={{ fontWeight: "500" ,marginRight:'4px'}}>Product name: </div>{ obj.productname}
                  </div>

                  <br />
                  
                  <div style={{display:'flex'}}>
                    <div style={{ fontWeight: "500" ,marginRight:'4px'}}>Price: </div>{ obj.price}
                  </div>
                  <br />
                  <p style={{ fontWeight: "500" }}>
                    Quantity:
                    <span> </span>
                    <Button size="xs" onClick={DecrementQuantity}>
                      -
                    </Button>
                    <span> </span>
                    <input
                      style={{ textAlign: "center" }}
                      type="number"
                      placeholder="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <span> </span>
                    <Button size="xs" onClick={IncrementQuantity}>
                      +
                    </Button>
                  </p>
                  
                  <div style={{display:'flex',marginBottom:'10px'}}>
                    <div style={{ fontWeight: "500" ,marginRight:'4px'}}>Final Price: </div>{ quantity * obj.price}
                  </div>

                  <Button size="xs" onClick={doneBtn}>
                    Done
                  </Button>

                  <section>
                    <Table className="mt-5">
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell> ID</TableHeaderCell>
                          <TableHeaderCell>PRODUCT NAME</TableHeaderCell>
                          <TableHeaderCell>PRICE</TableHeaderCell>
                          <TableHeaderCell>QUANTITY</TableHeaderCell>
                          <TableHeaderCell>TOTAL PRICE</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell><p style={{color:'black',fontWeight:'500'}}>{item.id}</p></TableCell>
                            <TableCell>
                              <Text > <p style={{color:'black',fontWeight:'500'}}>{item.productname}</p></Text>
                            </TableCell>
                            <TableCell>
                              <Text><p style={{color:'black',fontWeight:'500'}}>{item.price}</p></Text>
                            </TableCell>
                            <TableCell>
                              <Text><p style={{color:'black',fontWeight:'500'}}>{item.quantity}</p></Text>
                            </TableCell>
                            <TableCell>
                            <Text><p style={{color:'black',fontWeight:'500'}}>{item.price * item.quantity}</p></Text>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="xs"
                                onClick={() =>
                                  deleteItem(item.id, item.price, item.quantity)
                                }
                              >
                                Delete
                              </Button>
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
  } else if (
    changePage == true &&
    billPage == false &&
    hasSessionData == true
  ) {
    return navigate("/display");
  }
}