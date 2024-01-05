import React, { useState } from 'react'

export default function Billing() {
  const [state,setState]=useState(false)
  const proceedBtn=()=>{
  setState(true)

  }
  const doneBtn=()=>{
    console.log("hi");
  }
  if(!state){
  return (
      <>
      <p>Customer Details</p>
        <form action="">
          <input type="text" placeholder='Enter Customer name:' />;
          <input type="text" placeholder='Enter customer phone no:' />;
        </form>

      <p>Item Details</p>
      <div>
      <input type="text" placeholder='Item code' />
      <button>-</button>
      <input type="number" placeholder='Quantity'/>
      <button>+</button>

      <span>price:{'value'}</span>
      </div>
      
      <p>Total sum</p>
      <button onClick={proceedBtn}>Proceed</button>




      </>
  )}
  else{
    return(
      <>
      <p>qr code with total bill </p>
      <button onClick={doneBtn}>done</button>
      </>
    )
  }

}
