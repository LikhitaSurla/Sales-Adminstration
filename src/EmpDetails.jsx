import React,{useReducer, useState} from 'react'
import employeeData from './Employee';
import { empReducer, firststate } from './empReducer';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './config/firebase';

export default function EmpDetails() {
  const[state,dispatch]=useReducer(empReducer,firststate)
 const employeeCollectionRef =collection(db,'employeedata')
 const[form,setForm]=useState(false);
let employeeDb;
    const employeeDetails=async()=>{
        
        // let matchFound=false;
        try{
             employeeDb = await employeeData();
             console.log(employeeDb)
            
        }catch(err){
            console.error(err);
        }
    }
    employeeDetails();

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
        setForm(true);
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
}catch(err){
       console.error(err) 
}
    }
if(state==true){
  return (
<>
<input type="text" name="empid" placeholder='employeeid' onChange={handleChange}/>
<input type="text" name="empname" placeholder='enter name'onChange={handleChange} />
<input type="number" name="age" placeholder='enter age'onChange={handleChange}/>
<input type="text" name="gender" placeholder='enter gender' onChange={handleChange}/>
<input type="number" name="phonenumber" placeholder='enter ph.number' onChange={handleChange}/>
<input type="text" name="salary" placeholder='salary' onChange={handleChange}/>
<input type="text" name="bonus" placeholder='bonus' onChange={handleChange}/>



</>  )}
else{
    return(
        <>
        <button onClick={addEmployee}>addEmployee</button>
        <div>{employeeDb.map((item,index)=>(
       <div key={index} >{item.empid},{item.name}</div>
    ))}
    </div>
        </>
    )
}
}
