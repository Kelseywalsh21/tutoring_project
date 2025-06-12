import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Language Tutoring</div>
      <ul className="navbar-links">
        <li><NavLink to="/">Dashboard</NavLink></li>
        <li><NavLink to="/students">Students</NavLink></li>
        <li><NavLink to="/courses">Courses</NavLink></li>
        <li><NavLink to="/tutors">Tutors</NavLink></li>
        <li><NavLink to="/sessions">Sessions</NavLink></li>
        <li><NavLink to="/attendance">Attendance</NavLink></li>
        <li><NavLink to="/tests">Tests</NavLink></li>
        <li><NavLink to="/change-requests">Requests</NavLink></li>
      </ul>
    </nav>
  );
};

export default NavBar