import { BrowserRouter as Router,Routes,Route,} from "react-router-dom";
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
import Featurespage from "./AdminFeaturesPages/Featurespage";

export default function App() {
  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element={<LoginPro />} />
            <Route path='/display' element={<Display/>}/>
            <Route path='/display/admin' element={<Admin/>}/>
            <Route path='/display/admin/featurespage' element={<Featurespage/>}/>
            <Route path='/display/billing' element={<Billing/>}/>
            <Route path="/display/admin/featurespage/salesdata" element={<SalesData />}/>
            <Route path='/display/admin/featurespage/empdetails' element={<EmpDetails />}/>
            <Route path="/display/admin/featurespage/customerreviews" element={<CustomerReviews />}/>
            <Route path="/display/admin/featurespage/newcustomers" element={<NewCustomers />}/>
            <Route path="/review" element={<Review />}/>
        </Routes>
    </Router>
    </>
  )
}