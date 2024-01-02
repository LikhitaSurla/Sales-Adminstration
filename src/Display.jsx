import React,{useState} from 'react'
import Admin from './Admin.jsx'
import Billing from './Billing.jsx'

export default function Display() {

const [display,setDisplay]=useState(true)
const [admin,setAdmin]=useState(false)
const [billing,setBilling]=useState(false)

const adminClicked=()=>{
  setAdmin(true)
  setDisplay(false)
}
const billingClicked=()=>{
  setBilling(true)
  setDisplay(false)
}
if(display===true){
  return (
    <>
    
    <div>Who are using this ?</div>
    <button onClick={adminClicked}>Admin</button>
    <button onClick={billingClicked}>Billing</button>
    </>
  )
}
else if(display==false && admin==true){
  return(
  <>
  <Admin setAdmin={setAdmin} setDisplay={setDisplay} />
  </>
  )
}
else{
  return(
  <>
  <Billing setBilling={setBilling} setDisplay={setDisplay} billing={billing}/>

  </>
  )
}
}
