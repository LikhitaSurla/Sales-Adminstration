import React,{useEffect, useReducer, useState} from 'react'
import employeeData from './FetchingData/Employee';
import { empReducer, firststate } from './FetchingData/empReducer';
import { addDoc,query,where, collection, deleteDoc, getDocs,doc,getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config/firebase';

export default function EmpDetails() {
    const[state,dispatch]=useReducer(empReducer,firststate)
    const employeeCollectionRef =collection(db,'employeedata')
    const[form,setForm]=useState(false);
    const [empData,setEmpData] = useState([]);
    const[updateData,setUpdateData] = useState(false);
    const[tempId,setTempId] = useState('');
    const[empDetails,setEmpDetails] = useState([]);
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


    const updateEmployeeBtn=async(id)=>{
       setTempId(id);
       setUpdateData(true);
       const dataa = doc(employeeCollectionRef,'S001');
       dataa.map((vall)=>{
        console.log(vall.name)
       })
    }

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
                    name:'likhita',
                    gender:'female'
                });
                employeeDetails();
            } else {
                console.error(`Document with empid ${id} not found.`);
            }
        } catch (err) {
            console.log('message',err);
        }
    }
    

    if(updateData){
        return(
            <> 
            <input type="text" name="empid" placeholder='employeeid' readOnly/>
            <input type="text" name="empname" placeholder='enter name' value={name} onChange={(e)=>setName(e.target.value)} />
            <input type="number" name="age" placeholder='enter age'onChange={handleChange}/>
            <input type="text" name="gender" placeholder='enter gender' onChange={handleChange}/>
            <input type="number" name="phonenumber" placeholder='enter ph.number' onChange={handleChange}/>
            <input type="text" name="salary" placeholder='salary' onChange={handleChange}/>
            <input type="text" name="bonus" placeholder='bonus' onChange={handleChange}/>
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
            <input type="text" name="salary" placeholder='salary' onChange={handleChange}/>
            <input type="text" name="bonus" placeholder='bonus' onChange={handleChange}/>
            <button onClick={addEmployee}>Submit</button>
        </> 
    )}
else{
    return(
        <> 
        <button onClick={viewDetails}>Add new</button>
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
        ))}        
        </>
    )
}
}
