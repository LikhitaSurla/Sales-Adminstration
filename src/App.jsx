import { BrowserRouter as Router,Routes,Route,useNavigate} from "react-router-dom";
import EmpDetails from "./AdminFeaturesPages/EmpDetails";
import SalesData from "./AdminFeaturesPages/SalesData";
import React from 'react'
import Admin from "./AftDisplyPages/Admin";
import Display from "./Display";
import LoginPro from "./LoginPro";
import CustomerReviews from "./AdminFeaturesPages/CustomerReviews";
import NewCustomers from "./AdminFeaturesPages/NewCustomers";
import Billing from "./AftDisplyPages/Billing";
import Review from "./AdminFeaturesPages/Review";

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
            <Route path="/review" element={<Review />}/>
        </Routes>
    </Router>
    </>
  )
}