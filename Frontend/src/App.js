import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard'; // Create this component for the admin dashboard

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<LoginRegister />} />
            <Route path="/admin" element={<AdminDashboard />} />
         </Routes>
      </Router>
   );
}

export default App;