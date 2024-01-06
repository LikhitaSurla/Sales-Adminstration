import React,{useEffect, useReducer, useState} from 'react'
import employeeData from './Employee';
import { empReducer, firststate } from './empReducer';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './config/firebase';

export default function EmpDetails() {
    const[state,dispatch]=useReducer(empReducer,firststate)
    const employeeCollectionRef =collection(db,'employeedata')
    const[form,setForm]=useState(false);
    const [empData,setEmpData] = useState([]);
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
if(form==true){
  return (
    <>
        <input type="text" name="empid" placeholder='employeeid' onChange={handleChange}/>
        <input type="text" name="empname" placeholder='enter name'onChange={handleChange} />
        <input type="number" name="age" placeholder='enter age'onChange={handleChange}/>
        <input type="text" name="gender" placeholder='enter gender' onChange={handleChange}/>
        <input type="number" name="phonenumber" placeholder='enter ph.number' onChange={handleChange}/>
        <input type="text" name="salary" placeholder='salary' onChange={handleChange}/>
        <input type="text" name="bonus" placeholder='bonus' onChange={handleChange}/>
        <button onClick={addEmployee}>addEmployee</button>
    </> 
 )}
else{
    return(
        <>
        <button onClick={viewDetails}>View Details</button>
        <div>
            {empData.map((data)=>(
                <>
                <h1>{data.empid}</h1>
                <h1>{data.name}</h1>
                <h1>{data.age}</h1>
                <h1>{data.gender}</h1>
                <h1>{data.phoneNumber}</h1>
                </>
            ))}
    </div>
        </>
    )
}
}
