import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AttendanceAdmin from './pages/admin/Attendance';
import ProtectedAuthorization from './hooks/useAuth';
import Employees from './pages/admin/Employees';
import EmployeeDetail from './pages/admin/EmployeeDetail';
import MyAttendance from './pages/employee/MyAttendance';
import TodayAttendance from './pages/employee/TodayAttendance';
import Profile from './pages/employee/Profile';

const EmployeeDetailWrapper = () => {
  const { id } = useParams();
  return <EmployeeDetail employeeId={id} mode="edit" />;
};


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/attendance" element={
            <ProtectedAuthorization roles={["ADMIN", "ADMIN EMPLOYEE"]}>
              <AttendanceAdmin />
            </ProtectedAuthorization>
          } />
          <Route path="/employee" element={
            <ProtectedAuthorization roles={["ADMIN", "ADMIN EMPLOYEE"]}>
              <Employees />
            </ProtectedAuthorization>
          } />
          <Route path="/employee/edit/:id" element={
            <ProtectedAuthorization roles={["ADMIN", "EMPLOYEE", "ADMIN EMPLOYEE"]}>
              <EmployeeDetailWrapper />
            </ProtectedAuthorization>
          } />
          <Route path="/add" element={
            <ProtectedAuthorization roles={["ADMIN", "ADMIN EMPLOYEE"]}>
              <EmployeeDetail mode="add"/>
            </ProtectedAuthorization>
          } />
          <Route path="/my-attendance" element={
            <ProtectedAuthorization roles={["EMPLOYEE", "ADMIN", "ADMIN EMPLOYEE"]}>
              <MyAttendance />
            </ProtectedAuthorization>
          } />
          <Route path="/today-attendance" element={
            <ProtectedAuthorization roles={["EMPLOYEE", "ADMIN", "ADMIN EMPLOYEE"]}>
              <TodayAttendance />
            </ProtectedAuthorization>
          } />
          <Route path="/profile" element={
            <ProtectedAuthorization roles={["EMPLOYEE", "ADMIN", "ADMIN EMPLOYEE"]}>
              <Profile />
            </ProtectedAuthorization>
          } />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
