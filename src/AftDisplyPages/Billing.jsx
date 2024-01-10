import React from 'react'

export default function Billing() {
  return (
    <div>
      <section>
        <p>Customer Detail:s</p>
        <input type="text" placeholder='Customer name'/>
        <input type="text" placeholder='Customer Number'/>
      </section>

      <section>
        <p>Items:</p>
        <input type="text" placeholder='code' />
        <button>Submit</button>
          <div>
            <button>-</button>
            <p>quantity</p>
            <button>+</button>
          </div>
        <button>Generate Bill</button>
      </section>
    </div>
  )
}
