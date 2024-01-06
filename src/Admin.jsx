import React,{useState} from 'react'
import fetchData from './Data';
import EmpDetails from './EmpDetails';
export default function Admin(props) {
  const [state,setState] =useState(false);
  const [ownerName,setOwnerName]=useState('');
  const [ownerPassword,setOwnerPassword]=useState('');

   
    const ownerClicked =async()=>{
      let matchfound = false;
      try{
          const usersData = await fetchData();
          usersData.forEach((doc)=>{
           
            if(doc.name == ownerName && doc.password == ownerPassword){
              matchfound = true;
            
            }
          });
          if(matchfound){
            setState(true);
          }
      }
      catch(err){
        console.error(err);
      }
  }
    if(state==false){
      return (
        <>
        
        <input type="text" placeholder='name' onChange={(e)=>setOwnerName(e.target.value)} />
        <input type="password" placeholder='password' onChange={(e)=>setOwnerPassword(e.target.value)} />
        <button
        >Update my Password</button>
        <button onClick={ownerClicked}>submit</button>

        </>
      )
    }
    else{
      return(
        <>
        {/* <div>Sales Deatils</div> */}
        {/* <div>Employee Details</div> */}
        {/* <div>New Customer count</div>
        <div>Customer Reviews</div> */}
        <EmpDetails/>
        
        </>
      )
    }

}
