import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Tutors from './pages/Tutors';
import Sessions from './pages/Sessions';
import Attendance from './pages/Attendance';
import Tests from './pages/Tests';
import ChangeRequests from './pages/ChangeRequests';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/change-requests" element={<ChangeRequests />} />
      </Routes>
    </>
  );
}

export default App;