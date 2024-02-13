import React, { useEffect, useState } from 'react'
import employeeData from '../FetchingData/Employee'
import { addDoc, query, where, collection, deleteDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Title, Flex, } from "@tremor/react";
import '../Styling/index.css'
import { useNavigate } from 'react-router-dom';
import 'ldrs/bouncy'
import { Tooltip,TextField } from '@mui/material';  

import {MdKeyboardBackspace,FaIdCardClip,FaUserAlt,FaPhoneVolume,TbCoinRupeeFilled,RiUserHeartFill,IoMaleFemale,IoClose} from '../exp/reacticons'



export default function EmpDetails() {
  const employeeCollectionRef = collection(db, 'employeedata')
  const [form, setForm] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const [tempId, setTempId] = useState('');
  const [hasSessionData, setHasSessionData] = useState(false);
  const [hasAdminSessionData, setHasAdminSessionData] = useState(false);
  const[loading,setLoading] = useState(true);
  const [isPresent,setIsPresent] = useState(false);
  const [empDetails, setEmpDetails] = useState({
    empid: '',
    name: '',
    age: 0,
    gender: '',
    number: 0,
    salary: 0,
    bonus: 0,
  });
  const navigate = useNavigate();

  const employeeDetails = async () => {
    try {
      const employeeDb = await employeeData();
      setEmpData(employeeDb);
    } catch (err) {
      console.error(err);
    }
  }

  const sortedEmpData = empData.sort((a, b) => a.empid.localeCompare(b.empid));

  useEffect(() => {
    const checkSessionData = async () => {
      const dataInSession = sessionStorage.getItem('User');
      const dataInAdminSession = sessionStorage.getItem('admin');
      if(dataInAdminSession && dataInSession){
        setHasSessionData(true);
        setHasAdminSessionData(true);
      }
      else if (dataInSession){ 
        if(!dataInAdminSession){
          navigate('/display')
        }
      }
      else if(!dataInSession){
        navigate('/')
      }
    };
    checkSessionData();
    employeeDetails();
  }, [])

  setTimeout(()=>{
    setLoading(false);
  },800)

  const handleChange = (e) => {
    setEmpDetails(
      {
        ...empDetails, [e.target.name]: e.target.value
      }
    );
  }

  const addEmployee = async (e) => {
    e.preventDefault();
    let len = empDetails.number.toString().length;
    console.log(empDetails.empid);
  
    if (len === 10) {
      try {
        const q = await getDocs(query(employeeCollectionRef, where('empid', '==', empDetails.empid)));
        if (q.size > 0) {
          setIsPresent(true);
          setTimeout(()=>{
            setIsPresent(false);
          },1500)
        } else {
          await addDoc(employeeCollectionRef, {
            empid: empDetails.empid,
            name: empDetails.name,
            age: Number(empDetails.age),
            gender: empDetails.gender,
            phoneNumber: Number(empDetails.number),
            salary: Number(empDetails.salary),
            bonus: 0
          });
          employeeDetails();
          setForm(false);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Check Phone Number");
    }
  };
  

  const viewDetails = () => {
    setForm(true);
  }


  const deleteEmployee = async (id) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'employeedata'), where('empid', '==', id))
      );
      if (querySnapshot.docs.length > 0) {
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
        employeeDetails();
      } else {
        console.error(`Document with empid ${id} not found.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateEmployeeBtn = async (id) => {
    try {
      setTempId(id);
      setUpdateData(true);
      const q = query(employeeCollectionRef, where('empid', '==', id));
      const userCredentials = await getDocs(q);
      const data = [];
      userCredentials.forEach((doc) => {
        data.push(doc.data());
      });
      setEmpDetails({
        name: data[0].name,
        gender: data[0].gender,
        age: data[0].age,
        number: data[0].phoneNumber,
        salary: data[0].salary,
        bonus: data[0].bonus
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log(empDetails);
  }, [empDetails]);

  const removeForm=()=>{
    setForm(false)
    setUpdateData(false)
  }
  const handleUpdateButton = async (e) => {
    e.preventDefault();
    let len = empDetails.number.toString().length;
    if(len==10){
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'employeedata'), where('empid', '==', tempId))
      );
      if (querySnapshot.docs.length > 0) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          name: empDetails.name,
          age: Number(empDetails.age),
          gender: empDetails.gender,
          phoneNumber:Number(empDetails.number),
          salary: Number(empDetails.salary),
        });
        employeeDetails();
      } else {
        console.error(`Document with empid ${id} not found.`);
      }
    } catch (err) {
      console.log(err);
    }
    setForm(false);
    setUpdateData(false);
  }
  else{
    alert("Check Phone Number")
  }
  }
  if(loading && hasAdminSessionData && hasSessionData){
    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <l-bouncy
        size="45"
        speed="1.75"
        color="#0A1052" 
      ></l-bouncy>
    </div>
    )
  }
  else if (updateData &&hasSessionData && hasAdminSessionData) {
    return (
      <>
        <div className='employesubmit'>
          <Card style={{boxShadow:'-1px 2px 14px -1px rgba(0,0,0,0.34)'}}>
          <Tooltip title='Exit'><button style={{float:'right',marginTop:'1px',marginLeft:'-20px'}} className='backToFeaturesEmp' onClick={removeForm}>
            <IoClose style={{marginLeft:'7px'}}/>
</button></Tooltip>
            <form onSubmit={handleUpdateButton}>
          <Title style={{textAlign:'center',marginBottom:'25px'}}>Updating Employee Details</Title>
             
            <div className='formsordering'>

<FaIdCardClip 
 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}}  name="empid" value={tempId} id="outlined-disabled" label="Employee Id" variant="outlined"  onChange={handleChange} disabled
 inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>
<FaUserAlt 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}}  name="name" value={empDetails.name} id="outlined-basic"  variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>
<RiUserHeartFill 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='number' value={empDetails.age} name="age"  id="outlined-basic" variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>
<div className='formsordering'>
<IoMaleFemale 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}}  name="gender" value={empDetails.gender} id="outlined-basic"  variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>
<div className='formsordering'>
<FaPhoneVolume 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}}   type='number'name="number"  value={empDetails.number} id="outlined-basic"  variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>
<div className='formsordering'>
<TbCoinRupeeFilled 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='number' name="salary"  value={empDetails.salary} id="outlined-basic"  variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>
{/* <div className='formsordering'>
<GiTakeMyMoney 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='number'  name="bonus" value={empDetails.bonus} id="outlined-disabled"  variant="outlined"  disabled
 inputProps={{style: {height: 20}}}/>
</div> */}
{/* 
            <p>Employee ID : <input type="text" name="empid" placeholder='Employee id' value={tempId} readOnly /></p>
            <p>Employee Name : <input type="text" name="name" placeholder='Enter Name' value={empDetails.name} onChange={handleChange} required /></p>
            <p>Age : <input type="number" name="age" placeholder='Enter Age' value={empDetails.age} onChange={handleChange} required/></p>
            <p>Gender : <input type="text" name="gender" placeholder='Enter Gender' value={empDetails.gender} onChange={handleChange} required/></p>
            <p>Phone Number :<input type="number" name="number" placeholder='Enter Phone number' value={empDetails.number} onChange={handleChange} required/></p>
            <p> Salary : <input type="number" name="salary" placeholder='Salary' value={empDetails.salary} onChange={handleChange} required /></p>
            <p> Bonus :<input type="number" name="bonus" placeholder='Bonus' value={empDetails.bonus} readOnly/></p> */}
            <Button type='submit' style={{ margin: '0 auto', display: 'block' ,backgroundColor:'green',border:'none'}}>ChangeDetails</Button>
            </form>
          </Card>
        </div>
      </>
    )
  }
  else if (form == true &&hasSessionData &&hasAdminSessionData) {
    return (
      <>
        <div className='employesubmit'>
          <Card style={{boxShadow:'-1px 2px 14px -1px rgba(0,0,0,0.34)'}}>
            <Tooltip title='Exit'><button style={{float:'right',marginTop:'0px',marginLeft:'-20px'}} className='backToFeaturesEmp' onClick={removeForm}>
            <IoClose style={{marginLeft:'7px'}}/>
</button></Tooltip>
            <form onSubmit={addEmployee}>
              
            <Title style={{textAlign:'center',marginBottom:'15px'}}>Adding Employee</Title>
            <div className='formsordering'>

<FaIdCardClip 
 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}}  name="empid"  id="outlined-basic" label="Enter Employee Id" variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>
<FaUserAlt 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}}  name="name"  id="outlined-basic" label="Enter Employee Name" variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>

<div className='formsordering'>
<RiUserHeartFill 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='number' name="age"  id="outlined-basic" label="Enter Age" variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>
<div className='formsordering'>
<IoMaleFemale 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}}  name="gender"  id="outlined-basic" label="Enter Gender" variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>
<div className='formsordering'>
<FaPhoneVolume 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}}   type='number'name="number"  id="outlined-basic" label="Enter Phonenumber" variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>
<div className='formsordering'>
<TbCoinRupeeFilled 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='number' name="salary"  id="outlined-basic" label="Enter Salary" variant="outlined"  onChange={handleChange} required
 inputProps={{style: {height: 20}}}/>
</div>
{/* <div className='formsordering'>
<GiTakeMyMoney 
 size={22} style={{marginTop:'14px',marginLeft:'10px',marginRight:'10px'}} /> <TextField style={{width:'300px'}} type='number'  name="bonus"  id="outlined-disabled" label="Bonus" variant="outlined"  disabled
 inputProps={{style: {height: 20}}}/>
</div> */}

            {/* <p>Employee ID: <span></span><input type="text" name="empid" placeholder='Employee id' onChange={handleChange} required /></p> */}
            {/* <p> Employee Name : <input type="text" name="name" placeholder='enter name' onChange={handleChange} required/></p>
            <p> Age :  <input type="number" name="age" placeholder='Enter Age' onChange={handleChange} required/></p>
            <p>Gender :   <input type="text" name="gender" placeholder='Enter Gender' onChange={handleChange} required/></p>
            <p> Phone Number :<input type="number" name="number" placeholder='Enter Phonenumber' onChange={handleChange} required/></p>
            <p>Salary: <input type="number" name="salary" placeholder='Salary' onChange={handleChange} required/></p>
            <p> Bonus :<input type="number" name="bonus" placeholder='Bonus' onChange={handleChange} required/></p> */}
            {/* <Button type='submit' style={{marginLeft:'150px'}}>Submit</Button> */}
            <Button type='submit' style={{ margin: '0 auto', display: 'block',border:'none',backgroundColor:'green'}}>SUBMIT</Button>

            {isPresent && <p style={{color:'red',marginTop:8,textAlign:'center'}}>Employee Already Present</p> } 
            </form>
          </Card>
        </div>
      </>
    )
  }
  else if(hasSessionData){
    return (
      <>
        <Card>
          <Tooltip ><button style={{marginTop:'0',marginLeft:-8}} className='backToFeaturesPage' onClick={()=>navigate('/display/admin/featurespage')}>
            <MdKeyboardBackspace color='black' style={{marginLeft:'8px'}} size={30}/>
</button></Tooltip>
          <Title style={{textAlign:'center',marginTop:'-35px'}}><b>EMPLOYEE DETAILS</b></Title>
          <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">

            <Button size="xs" onClick={viewDetails}> +Add new</Button></Flex>
          <Table className="mt-5">

            <TableHead>
              <TableRow>
                <TableHeaderCell>EMPLOYEE ID</TableHeaderCell>
                <TableHeaderCell>EMPLOYEE NAME</TableHeaderCell>
                <TableHeaderCell>AGE</TableHeaderCell>
                <TableHeaderCell>GENDER</TableHeaderCell>
                <TableHeaderCell>PHONE NUMBER</TableHeaderCell>
                <TableHeaderCell>SALARY</TableHeaderCell>
                <TableHeaderCell>BONUS</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEmpData.map((data) => (
                <TableRow key={data.empid}>
                  <TableCell>{data.empid}</TableCell>
                  <TableCell>
                    <Text>{data.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{data.age}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{data.gender}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{data.phoneNumber}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{data.salary}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{data.bonus}</Text>
                  </TableCell>
                  <TableCell>
                    <Button size="xs" onClick={() => updateEmployeeBtn(data.empid)}>Update</Button>
                  </TableCell>
                  <TableCell>
                    <Button size="xs" onClick={() => deleteEmployee(data.empid)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>


      </>
    )
  }
}