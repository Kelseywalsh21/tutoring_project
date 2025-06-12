import { useState, useEffect } from 'react';
import './Students.css';

const API_BASE = 'http://localhost:8000'; 

export default function Students() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [newStudent, setNewStudent] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      year: '',
      course: '',
      dlptScore:'',
      level: ''
    });

    useEffect(() => {
        fetch(`${API_BASE}/api/tutors/`)
          .then(res => res.json())
          .then(setTutors)
          .catch(err => console.error('Error fetching tutors:', err));
    
        fetch(`${API_BASE}/api/students/`)
          .then(res => res.json())
          .then(setStudents)
          .catch(err => console.error('Error fetching students:', err));
    
        fetch(`${API_BASE}/api/courses/`)
          .then(res => res.json())
          .then(setCourses)
          .catch(err => console.error('Error fetching courses:', err));
      }, []);
    



    const handleChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };


    const handleAddStudent = () => {
      const studentToAdd = {
        ...newStudent,
        course: parseInt(newStudent.course),
        year: parseInt(newStudent.year),
        dlptScore: newStudent.dlptScore === '' ? null : parseFloat(newStudent.dlptScore)
      };
    
      console.log('Student being added:', studentToAdd);
    
      fetch(`${API_BASE}/api/students/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentToAdd)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to add student');
          return res.json();
        })
        .then(student => {
          setStudents([...students, student]);
          setNewStudent({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            year: '',
            course: '',
            dlptScore: '',
            level: ''
          });
        })
        .catch(err => console.error('Add student error:', err));
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
        course: parseInt(student.course)
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
        const matchesName = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchName.toLowerCase());
        const matchesLevel = levelFilter === '' || student.level === levelFilter;
        const matchesYear = yearFilter === '' || student.year === yearFilter;
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
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>

                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                    <option value="">All Years</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(student => (
                        <tr key={student.id}>
                            {editingId === student.id ? (
                                <>
                                    <td>
                                        <input value={student.firstName} onChange={e => handleFieldEdit(student.id, 'firstName', e.target.value)} />{' '}
                                        <input value={student.lastName} onChange={e => handleFieldEdit(student.id, 'lastName', e.target.value)} />
                                    </td>
                                    <td><input value={student.email} onChange={e => handleFieldEdit(student.id, 'email', e.target.value)} /></td>
                                    <td><input value={student.phoneNumber} onChange={e => handleFieldEdit(student.id, 'phoneNumber', e.target.value)} /></td>
                                    <td><input value={student.year} onChange={e => handleFieldEdit(student.id, 'year', e.target.value)} /></td>
                                    <td>
                                        <select value={student.level} onChange={e => handleFieldEdit(student.id, 'level', e.target.value)}>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select value={student.course} onChange={e => handleFieldEdit(student.id, 'course', parseInt(e.target.value))}>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>{course.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleSave(student.id)}>Save</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phoneNumber}</td>
                                    <td>{student.year}</td>
                                    <td>{student.level}</td>
                                    <td>{courses.find(c => c.id === student.course)?.name || 'N/A'}</td>
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
                <input name="firstName" value={newStudent.firstName} placeholder="First Name" onChange={handleChange} />
                <input name="lastName" value={newStudent.lastName} placeholder="Last Name" onChange={handleChange} />
                <input name="email" value={newStudent.email} placeholder="Email" onChange={handleChange} />
                <input name="phoneNumber" value={newStudent.phoneNumber} placeholder="Phone Number" onChange={handleChange} />
                <input name="year" value={newStudent.year} placeholder="Year" onChange={handleChange} />
                <select name="level" value={newStudent.level} onChange={handleChange}>
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
                <select name="course" value={newStudent.course} onChange={handleChange}>
                    <option value="">Select Course</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                </select>
                <button onClick={handleAddStudent}>Add</button>
            </div>
        </div>
    );
}