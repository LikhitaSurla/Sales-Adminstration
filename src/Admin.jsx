import React from 'react'

export default function Admin(props) {
    const backclick=()=>{
        props.setAdmin(false)
        props.setDisplay(true)
    }
  return (
    <>
    <div>Admin</div>
    <button onClick={backclick}>Back</button>
    </>
  )
}
