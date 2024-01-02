import React,{useState} from 'react'

export default function Billing(props) {
    const backclick=()=>{
        props.setDisplay(true)
        props.setBilling(false)
    }

   const [popup,setPopup]=useState(true)
    console.log(popup)
    const formsubmit=()=>{
        setPopup(false)
    }
    if(popup==true){

  return (<>
    <button onClick={backclick}>Back</button>
    <form action="form-submit">
        <input type="text" />
        <button onClick={formsubmit}>Submit</button>
    </form>
   
    </>
  )}
  else {
    return(
       <>
       <div>UserId: db,name</div>


       <div>billing</div>
       <form action="">
        <input type="text" />
        <button>submit-code</button>
       </form>

       <div>customer-details</div>
       <form action="">
        <input type="text" placeholder='enter name' />
        <input type="text" placeholder='phone number' />
       </form>      

      </>
    )
  }
}
