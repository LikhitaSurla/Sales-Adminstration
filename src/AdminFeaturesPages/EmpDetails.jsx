import React, { useEffect, useState } from 'react'
import employeeData from '../FetchingData/Employee'
import { addDoc, query, where, collection, deleteDoc, getDocs,updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Title, Flex, } from "@tremor/react";
import '../Styling/index.css'
import {  useNavigate } from 'react-router-dom';
import 'ldrs/bouncy'
import { Tooltip,TextField } from '@mui/material';  
import {MdKeyboardBackspace,FaIdCardClip,TbLetterX,FaUserAlt,FaPhoneVolume,TbCoinRupeeFilled,RiUserHeartFill,IoMaleFemale,IoClose} from '../exp/reacticons'



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
  const [searchedEmp,setSearchedEmp] = useState(false);
  const [isValidId,setIsValidId] = useState(false);
  const [empCode,setEmpCode] = useState('');
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

  const searchEmp=async(e)=>{
    e.preventDefault();
    let present = false;
    let userId = empCode.toUpperCase()
    try{
      const q = query(employeeCollectionRef, where("empid", "==", userId));
      const product = await getDocs(q);
      const data = [];
      product.forEach((doc) => {
        data.push(doc.data());
      });
      setEmpDetails({
        empid: data[0].empid,
        name: data[0].name,
        age: data[0].age,
        gender:data[0].gender,
        number: data[0].phoneNumber,
        salary: data[0].salary,
        bonus: data[0].bonus,
      })
      present = true
  }
    catch{
      console.log('Error')
    }
    if(present){
      setSearchedEmp(true)
    }
    else{
      setIsValidId(true)
      setEmpCode("")
      setTimeout(()=>{
        setIsValidId(false)
      },1200)
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
      <div className='bgimageemp'>
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
            <Button type='submit' style={{ margin: '0 auto', display: 'block' ,backgroundColor:'green',border:'none'}}>ChangeDetails</Button>
            </form>
          </Card>
        </div>
        </div>
      </>
    )
  }
  else if (form == true &&hasSessionData &&hasAdminSessionData) {
    return (
      <>
            <div className='bgimageemp'>

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

            <Button type='submit' style={{ margin: '0 auto', display: 'block',border:'none',backgroundColor:'green'}}>SUBMIT</Button>

            {isPresent && <p style={{color:'red',marginTop:8,textAlign:'center'}}>Employee Already Present</p> } 
            </form>
          </Card>
        </div>
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
          <Title style={{textAlign:'center',marginTop:'-35px'}}><b>EMPLOYEE DETAILS</b>
          </Title>
          
          <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">

            <Button size="xs" style={{marginBottom:20}} onClick={viewDetails}> +Add new</Button>
            </Flex>

          <form onSubmit={searchEmp} style={{float:'right',marginTop:-53,marginRight:40}}>
           <input style={{height:'40px',width:'300px'}} type="text" name="search" id="search" value={empCode} placeholder='Search With Employee Id' onChange={(e)=>setEmpCode(e.target.value)} required/>

           <button type='submit' style={{backgroundColor:'grey',marginLeft:5,width:65,color:'white',height:37,borderRadius:4}}>Search</button>
          {isValidId && <p style={{fontSize:14,marginTop:-10,marginLeft:2,color:'red'}}>*Employee not present</p>}
           </form>
            {searchedEmp &&
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
               
                 <TableRow key={empDetails.empid}>
                   <TableCell>{empDetails.empid}</TableCell>
                   <TableCell>
                     <Text>{empDetails.name}</Text>
                   </TableCell>
                   <TableCell>
                     <Text>{empDetails.age}</Text>
                   </TableCell>
                   <TableCell>
                     <Text>{empDetails.gender}</Text>
                   </TableCell>
                   <TableCell>
                     <Text>{empDetails.number}</Text>
                   </TableCell>
                   <TableCell>
                     <Text>{empDetails.salary}</Text>
                   </TableCell>
                   <TableCell>
                     <Text>{empDetails.bonus}</Text>
                   </TableCell>
                   <TableCell>
                     <Button size="xs" onClick={() => updateEmployeeBtn(empDetails.empid)}>Update</Button>
                   </TableCell>
                   <TableCell>
                     <Button size="xs" style={{backgroundColor:'maroon',border:'None'}} onClick={() => {deleteEmployee(empDetails.empid),setSearchedEmp(false),setEmpCode('')}}>Delete</Button>
                   </TableCell>
                   <TableCell>
                     <button  style={{Color:'black',border:'none',borderRadius:'50%',height:'30px',width:'25px'}} onClick={() =>{ setSearchedEmp(false),setEmpCode('')}}><  TbLetterX size={15}/>
</button>
                   </TableCell>
                 </TableRow>

             </TableBody>
           </Table>
            }

            {searchedEmp==false&&
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
                    <Button size="xs" style={{backgroundColor:'maroon',border:'None'}} onClick={() => deleteEmployee(data.empid)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            }
            
               
  
        </Card>

      </>
    )
  }
}