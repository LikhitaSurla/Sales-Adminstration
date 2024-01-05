import React from 'react'

export default function Billing() {
  return (
      <>
      <p>Customer Details</p>
        <form action="">
          <input type="text" placeholder='Enter Customer name:' />;
          <input type="text" placeholder='Enter customer phone no:' />;
        </form>

      <p>Item Details</p>
      <input type="text" placeholder='Item code' />
      <button>-</button>
      <input type="number" placeholder='Quantity'/>
      <button>+</button>

      <p>price:{'value'}</p>
      </>
  )
}
