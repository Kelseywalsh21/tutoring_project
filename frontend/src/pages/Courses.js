import { useState, useEffect } from 'react';
import './Courses.css';

const API_BASE = 'http://localhost:8000';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    tutor: '',
    language: '',
    format: '',
    total_hours: '',
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
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };
  
  const handleAddCourse = () => {

    fetch(`${API_BASE}/api/courses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newCourse,
        tutorId: parseInt(newCourse.tutor),
        totalHours: parseInt(newCourse.total_hours)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add course');
        return res.json();
      })
      .then(course => {
        setCourses([...courses, course]);
        setNewCourse({
          name: '',
          description: '',
          tutor: '',
          language: '',
          format: '',
          total_hours: '',
          level: ''
        });
      })
      .catch(err => console.error('Add course error:', err))

  };

  const handleEdit = (id) => setEditingId(id);

  const handleSave = (id) => {
    const courseToUpdate = courses.find(c => c.id === id);
    fetch(`${API_BASE}/api/courses/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...courseToUpdate,
        tutorId: parseInt(courseToUpdate.tutor),
        totalHours: parseInt(courseToUpdate.total_hours)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update course');
        return res.json();
      })
      .then(updatedCourse => {
        setCourses(courses.map(c => c.id === id ? updatedCourse : c));
        setEditingId(null);
      })
      .catch(err => console.error('Update course error:', err));
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE}/api/courses/${id}/`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete course');
        setCourses(courses.filter(c => c.id !== id));
      })
      .catch(err => console.error('Delete course error:', err));
  };


  const handleFieldEdit = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const getStudentsInCourse = (courseId) =>
    students.filter(s => s.course === courseId);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses-container">
      <h1>Courses</h1>

      <input
        type="text"
        placeholder="Search by name or language"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table className="courses-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Tutor</th>
            <th>Language</th>
            <th>Format</th>
            <th>Total Hours</th>
            <th>Level</th>
            <th>Students</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map(course => {
            const enrolledStudents = getStudentsInCourse(course.id);

            return (
              <tr key={course.id}>
                {editingId === course.id ? (
                  <>
                    <td><input value={course.name} onChange={e => handleFieldEdit(course.id, 'name', e.target.value)} /></td>
                    <td><input value={course.description} onChange={e => handleFieldEdit(course.id, 'description', e.target.value)} /></td>
                    <td>
                      <select
                        value={course.tutor}
                        onChange={e => handleFieldEdit(course.id, 'tutor', parseInt(e.target.value))}
                      >
                        <option value="">Assign Tutor</option>
                        {tutors.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.first_name} {t.last_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td><input value={course.language} onChange={e => handleFieldEdit(course.id, 'language', e.target.value)} /></td>
                    <td><input value={course.format} onChange={e => handleFieldEdit(course.id, 'format', e.target.value)} /></td>
                    <td><input type="number" value={course.total_hours} onChange={e => handleFieldEdit(course.id, 'total_hours', parseInt(e.target.value))} /></td>
                    <td><input value={course.level} onChange={e => handleFieldEdit(course.id, 'level', e.target.value)} /></td>
                    <td>{enrolledStudents.length}</td>
                    <td><button onClick={() => handleSave(course.id)}>Save</button><button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{course.name}</td>
                    <td>{course.description}</td>
                    <td>
                      {(() => {
                        const tutor = tutors.find(t => t.id === course.tutor);
                        return tutor ? `${tutor.first_name} ${tutor.last_name}` : 'Unassigned';
                      })()}
                    </td>
                    <td>{course.language}</td>
                    <td>{course.format}</td>
                    <td>{course.total_hours}</td>
                    <td>{course.level}</td>
                    <td>
                      <details>
                        <summary>{enrolledStudents.length} student(s)</summary>
                        <ul>
                          {enrolledStudents.map(s => (
                            <li key={s.studentId}>{s.first_name} {s.last_name}</li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(course.id)}>Edit</button>
                      <button onClick={() => handleDelete(course.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Add Course</h2>
      <div className="add-course-form">
        <input name="name" placeholder="Name" value={newCourse.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={newCourse.description} onChange={handleChange} />
        <select name="tutor" value={newCourse.tutor} onChange={handleChange}>
          <option value="">Assign Tutor</option>
          {tutors.map(t => (
            <option key={t.id} value={t.id}>
              {t.first_name} {t.last_name}
            </option>
          ))}
        </select>
        <input name="language" placeholder="Language" value={newCourse.language} onChange={handleChange} />
        <input name="format" placeholder="Format" value={newCourse.format} onChange={handleChange} />
        <input name="total_hours" type="number" placeholder="Total Hours" value={newCourse.total_hours} onChange={handleChange} />
        <input name="level" placeholder="Level" value={newCourse.level} onChange={handleChange} />
        <button onClick={handleAddCourse}>Add</button>
      </div>
    </div>
  );
}