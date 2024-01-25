import React,{useEffect, useReducer, useState} from 'react'
import employeeData from '../FetchingData/Employee'
import { empReducer, firststate } from '../FetchingData/empReducer'
import { addDoc,query,where, collection, deleteDoc, getDocs,doc,getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {Button,Card,Table,TableBody,TableCell,TableHead,TableHeaderCell,TableRow,Text,Title,} from "@tremor/react";


export default function EmpDetails() {
    const[state,dispatch]=useReducer(empReducer,firststate)
    const employeeCollectionRef =collection(db,'employeedata')
    const[form,setForm]=useState(false);
    const [empData,setEmpData] = useState([]);
    const[updateData,setUpdateData] = useState(false);
    const[tempId,setTempId] = useState('');
    const [empDetails, setEmpDetails] = useState({
        empid: '',
        name: '',
        age: 0,
        gender: '',
        number: 0,
        salary: 0,
        bonus: 0,
    });


    const employeeDetails=async()=>{
        try{
            const employeeDb = await employeeData();
            setEmpData(employeeDb);
        }catch(err){
            console.error(err);
        }
    }
    useEffect(()=>{
        employeeDetails();
    },[])


    const handleChange=(e)=>{
        dispatch(
            {
                type:'changeInput',
                payload:{name: e.target.name,
                value:e.target.value }
            }
        )
        console.log(state)
    }


    const addEmployee=()=>{
        setForm(false);
        try{
            addDoc(employeeCollectionRef,{
                empid:state.empid,
                name:state.empname,
                age:state.age,
                gender:state.gender,
                phoneNumber:state.phonenumber,
                salary:state.salary,
                bonus:state.bonus
            })
            employeeDetails();
        }catch(err){
            console.error(err) 
        }
    }


    const viewDetails =()=>{
        setForm(true);
    }


    const deleteEmployee = async(id) => {
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
          age:data[0].age,
          number:data[0].phoneNumber,
          salary:data[0].salary,
          bonus:data[0].bonus  
        });
      } catch (err) {
        console.log(err);
      }
    };
    useEffect(() => {
      console.log(empDetails);
    }, [empDetails]); 
    

    const handleUpdateButton=async()=>{
        setForm(false);
        setUpdateData(false);
        try {
            const querySnapshot = await getDocs(
                query(collection(db, 'employeedata'), where('empid', '==',tempId ))
            );
            if (querySnapshot.docs.length > 0) {
                const docRef = querySnapshot.docs[0].ref;
                await updateDoc(docRef,{
                name:state.empname,
                age:state.age,
                gender:state.gender,
                phoneNumber:state.phonenumber,
                salary:state.salary,
                bonus:state.bonus
                });
                employeeDetails();
            } else {
                console.error(`Document with empid ${id} not found.`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    if(updateData){
        return(
        <> 
            <input type="text" name="empid" placeholder='employeeid'  value = {tempId} readOnly  />
            <input type="text" name="empname" placeholder='enter name' value={empDetails.name} onChange={handleChange} />
            <input type="number" name="age" placeholder='enter age'value={empDetails.age} onChange={handleChange}/>
            <input type="text" name="gender" placeholder='enter gender' value={empDetails.gender} onChange={handleChange}/>
            <input type="number" name="phonenumber" placeholder='enter ph.number' value={empDetails.number} onChange={handleChange}/>
            <input type="number" name="salary" placeholder='salary' value={empDetails.salary} onChange={handleChange}/>
            <input type="number" name="bonus" placeholder='bonus' value={empDetails.bonus} onChange={handleChange}/>
            <button onClick={handleUpdateButton}>changeDetails</button> 
        </>
        )
    }
    else if(form==true){
    return (
        <>  
            <input type="text" name="empid" placeholder='employeeid' onChange={handleChange}/>
            <input type="text" name="empname" placeholder='enter name'onChange={handleChange} />
            <input type="number" name="age" placeholder='enter age'onChange={handleChange}/>
            <input type="text" name="gender" placeholder='enter gender' onChange={handleChange}/>
            <input type="number" name="phonenumber" placeholder='enter ph.number' onChange={handleChange}/>
            <input type="number" name="salary" placeholder='salary' onChange={handleChange}/>
            <input type="number" name="bonus" placeholder='bonus' onChange={handleChange}/>
            <button onClick={addEmployee}>Submit</button>
        </> 
    )}
else{
    return(
        <> 

<Card>
    <Title>EMPLOYEE DETAILS</Title>
    <Button size="xs" onClick={viewDetails}> +Add new</Button>
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
            <Button size="xs"  onClick={() => deleteEmployee(data.empid)}>Update</Button>
              </TableCell>
              <TableCell>
            <Button size="xs" onClick={() => deleteEmployee(data.empid)}>Delete</Button>
              </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>

        {/* <button onClick={viewDetails}>Add new</button>
        {empData.map((data) => (
            <div key={data.empid}>
                <h1>{data.empid}</h1>
                <h1>{data.name}</h1>
                <h1>{data.age}</h1>
                <h1>{data.gender}</h1>
                <h1>{data.phoneNumber}</h1>
                <h1>{data.salary}</h1>
                <h1>{data.bonus}</h1>
                <button onClick={() => deleteEmployee(data.empid)}>Delete</button>
                <button onClick={() => updateEmployeeBtn(data.empid)}>Update</button>
            </div>
        ))}         */}
        </>
    )
}
}
