import { useState, useEffect } from 'react';
import './Students.css';

const API_BASE = 'http://localhost:8000';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [levels, setLevels] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    year: '',
    course: '',
    dlpt_score: '',
    level: '',
    address: ''
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/tutors/`).then(res => res.json()).then(setTutors);
    fetch(`${API_BASE}/api/students/`).then(res => res.json()).then(setStudents);
    fetch(`${API_BASE}/api/courses/`).then(res => res.json()).then(setCourses);
    fetch(`${API_BASE}/api/levels/`).then(res => res.json()).then(setLevels);
  }, []);

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = () => {
    const studentToAdd = {
      ...newStudent,
      course: newStudent.course === '' ? null : parseInt(newStudent.course),
      level: newStudent.level === '' ? null : parseInt(newStudent.level),
      year: newStudent.year === '' ? null : parseInt(newStudent.year),
      dlpt_score: newStudent.dlpt_score === '' ? null : parseFloat(newStudent.dlpt_score)
    };

    console.log('Student being added:', studentToAdd);

    fetch(`${API_BASE}/api/students/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentToAdd)
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => { throw data; });
        return res.json();
      })
      .then(student => {
        setStudents([...students, student]);
        setNewStudent({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          year: '',
          course: '',
          dlpt_score: '',
          level: '',
          address: ''
        });
      })
      .catch(err => {
        console.error('Add student error details:', err);
        console.error('Add student error:', new Error('Failed to add student'));
      });
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE}/api/students/${id}/`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete student');
        setStudents(students.filter(s => s.id !== id));
      })
      .catch(err => console.error('Delete student error:', err));
  };

  const handleEdit = (id) => setEditingId(id);

  const handleSave = (id) => {
    const student = students.find(s => s.id === id);
    fetch(`${API_BASE}/api/students/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...student,
        course: parseInt(student.course),
        level: parseInt(student.level)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update student');
        return res.json();
      })
      .then(updatedStudent => {
        setStudents(students.map(s => s.id === id ? updatedStudent : s));
        setEditingId(null);
      })
      .catch(err => console.error('Update student error:', err));
  };

  const handleFieldEdit = (id, field, value) => {
    setStudents(students.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const filtered = students.filter(student => {
    const matchesName = `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchName.toLowerCase());
    const matchesLevel = levelFilter === '' || String(student.level) === levelFilter;
    const matchesYear = yearFilter === '' || String(student.year) === yearFilter;
    const matchesCourse = courseFilter === '' || String(student.course) === courseFilter;
    return matchesName && matchesLevel && matchesYear && matchesCourse;
  });

  return (
    <div className="students-container">
      <h1>Students</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />

        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
          <option value="">All Levels</option>
          {levels.map(level => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>

        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
          <option value="">All Years</option>
          <option value="1">Freshman</option>
          <option value="2">Sophomore</option>
          <option value="3">Junior</option>
          <option value="4">Senior</option>
        </select>

        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Year</th>
            <th>Level</th>
            <th>Course</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(student => (
            <tr key={student.id}>
              {editingId === student.id ? (
                <>
                  <td>
                    <input value={student.first_name} onChange={e => handleFieldEdit(student.id, 'first_name', e.target.value)} />
                    <input value={student.last_name} onChange={e => handleFieldEdit(student.id, 'last_name', e.target.value)} />
                  </td>
                  <td><input value={student.email} onChange={e => handleFieldEdit(student.id, 'email', e.target.value)} /></td>
                  <td><input value={student.phone_number} onChange={e => handleFieldEdit(student.id, 'phone_number', e.target.value)} /></td>
                  <td><input value={student.year} onChange={e => handleFieldEdit(student.id, 'year', e.target.value)} /></td>
                  <td>
                    <select value={student.level} onChange={e => handleFieldEdit(student.id, 'level', e.target.value)}>
                      {levels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={student.course} onChange={e => handleFieldEdit(student.id, 'course', e.target.value)}>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </td>
                  <td><input value={student.address} onChange={e => handleFieldEdit(student.id, 'address', e.target.value)} /></td>
                  <td>
                    <button onClick={() => handleSave(student.id)}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{student.first_name} {student.last_name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone_number}</td>
                  <td>{student.year}</td>
                  <td>{levels.find(l => l.id === student.level)?.name || 'N/A'}</td>
                  <td>{courses.find(c => c.id === student.course)?.name || 'N/A'}</td>
                  <td>{student.address}</td>
                  <td>
                    <button onClick={() => handleEdit(student.id)}>Edit</button>
                    <button onClick={() => handleDelete(student.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add Student</h2>
      <div className="add-student-form">
        <input name="first_name" value={newStudent.first_name} placeholder="First Name" onChange={handleChange} />
        <input name="last_name" value={newStudent.last_name} placeholder="Last Name" onChange={handleChange} />
        <input name="email" value={newStudent.email} placeholder="Email" onChange={handleChange} />
        <input name="phone_number" value={newStudent.phone_number} placeholder="Phone Number" onChange={handleChange} />
        <input name="year" value={newStudent.year} placeholder="Year" onChange={handleChange} />
        <select name="level" value={newStudent.level} onChange={handleChange}>
          <option value="">Select Level</option>
          {levels.map(level => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>
        <select name="course" value={newStudent.course} onChange={handleChange}>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        <input name="address" value={newStudent.address} placeholder="Address" onChange={handleChange} />
        <button onClick={handleAddStudent}>Add</button>
      </div>
    </div>
  );
}