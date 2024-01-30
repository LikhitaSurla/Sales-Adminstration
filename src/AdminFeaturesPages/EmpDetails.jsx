import React, { useEffect, useReducer, useState } from 'react'
import employeeData from '../FetchingData/Employee'
import { addDoc, query, where, collection, deleteDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Title, Flex, } from "@tremor/react";
import '../Styling/index.css'


export default function EmpDetails() {
  const employeeCollectionRef = collection(db, 'employeedata')
  const [form, setForm] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const [tempId, setTempId] = useState('');
  const [empDetails, setEmpDetails] = useState({
    empid: '',
    name: '',
    age: 0,
    gender: '',
    number: 0,
    salary: 0,
    bonus: 0,
  });


  const employeeDetails = async () => {
    try {
      const employeeDb = await employeeData();
      setEmpData(employeeDb);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    employeeDetails();
  }, [])

  const handleChange = (e) => {

    setEmpDetails(
      {
        ...empDetails, [e.target.name]: e.target.value
      }
    );
  }


  const addEmployee = () => {
    setForm(false);
    try {
      addDoc(employeeCollectionRef, {
        empid: empDetails.empid,
        name: empDetails.name,
        age: empDetails.age,
        gender: empDetails.gender,
        phoneNumber: empDetails.number,
        salary: empDetails.salary,
        bonus: empDetails.bonus
      })
      employeeDetails();
    } catch (err) {
      console.error(err)
    }
  }


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


  const handleUpdateButton = async () => {
    setForm(false);
    setUpdateData(false);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'employeedata'), where('empid', '==', tempId))
      );
      if (querySnapshot.docs.length > 0) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { ...empDetails, phoneNumber: empDetails.number });
        employeeDetails();
      } else {
        console.error(`Document with empid ${id} not found.`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (updateData) {
    return (
      <>
        <div className='employesubmit'>
          <Title>Updating Employee Details</Title>
          <Card>
            <p>Employee ID : <input type="text" name="empid" placeholder='Employee id' value={tempId} readOnly /></p>
            <p>Employee Name : <input type="text" name="name" placeholder='Enter Name' value={empDetails.name} onChange={handleChange} /></p>
            <p>Age : <input type="number" name="age" placeholder='Enter Age' value={empDetails.age} onChange={handleChange} /></p>
            <p>Gender : <input type="text" name="gender" placeholder='Enter Gender' value={empDetails.gender} onChange={handleChange} /></p>
            <p>Phone Number :<input type="number" name="number" placeholder='Enter Phone number' value={empDetails.number} onChange={handleChange} /></p>
            <p> Salary : <input type="number" name="salary" placeholder='Salary' value={empDetails.salary} onChange={handleChange} /></p>
            <p> Bonus :<input type="number" name="bonus" placeholder='Bonus' value={empDetails.bonus} onChange={handleChange} /></p>


            <Button onClick={handleUpdateButton}>ChangeDetails</Button>
          </Card>
        </div>
      </>
    )
  }
  else if (form == true) {
    return (
      <>
        <div className='employesubmit'>

          <Card>
            <Title justifyContent='center'>Adding Employee</Title>
            <p>Employee ID: <span></span><input type="text" name="empid" placeholder='Employee id' onChange={handleChange} /></p>
            <p> Employee Name : <input type="text" name="name" placeholder='enter name' onChange={handleChange} /></p>
            <p> Age :  <input type="number" name="age" placeholder='Enter Age' onChange={handleChange} /></p>
            <p>Gender :   <input type="text" name="gender" placeholder='Enter Gender' onChange={handleChange} /></p>
            <p> Phone Number :<input type="number" name="number" placeholder='Enter Phonenumber' onChange={handleChange} /></p>
            <p>Salary: <input type="number" name="salary" placeholder='Salary' onChange={handleChange} /></p>
            <p> Bonus :<input type="number" name="bonus" placeholder='Bonus' onChange={handleChange} /></p>
            <Button onClick={addEmployee}>Submit</Button>
          </Card>
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <Card>
          <Title>EMPLOYEE DETAILS</Title>
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
              {empData.map((data) => (
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