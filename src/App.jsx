import { BrowserRouter as Router,Routes,Route,useNavigate} from "react-router-dom";
import EmpDetails from "./EmpDetails";
import SalesData from "./SalesData";
import React from 'react'
import Admin from "./Admin";
import Display from "./Display";
import LoginPro from "./LoginPro";
import CustomerReviews from "./CustomerReviews";
import NewCustomers from "./NewCustomers";
import Billing from "./Billing";

export default function App() {
  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element={<LoginPro />} />
            <Route path='/display' element={<Display/>}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/billing' element={<Billing/>}/>
            <Route path="/salesdata" element={<SalesData />}/>
            <Route path='/empdetails' element={<EmpDetails />}/>
            <Route path="/customerreviews" element={<CustomerReviews />}/>
            <Route path="/newcustomers" element={<NewCustomers />}/>


        </Routes>
    </Router>
    </>
  )
}