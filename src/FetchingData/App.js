import React from 'react'
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import Admin from '../Admin';
import EmpDetails from '../EmpDetails';
import SalesDetails from '../SalesDetails';

export default function App() {
  return (
<>
<Router>
<Routes basename='/Admin'>

    
        <Route path='/EmpDetails' component={EmpDetails}/>
        <Route path='/SalesDetails' component={SalesDetails}/>
        <Route path="/" component={Admin}/>

    </Routes>
</Router>
</>
  )
}
