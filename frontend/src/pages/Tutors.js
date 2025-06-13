
import { useState, useEffect } from 'react';
import './Tutors.css';

const API_BASE = 'http://localhost:8000'; 

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTutor, setNewTutor] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: ''
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

  
  const handleChange = (e) =>
    setNewTutor({ ...newTutor, [e.target.name]: e.target.value });

 
  const handleAddTutor = () => {
    fetch(`${API_BASE}/api/tutors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTutor)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add tutor');
        return res.json();
      })
      .then(tutor => {
        setTutors([...tutors, tutor]);
        setNewTutor({ first_name: '', last_name: '', email: '', phone_number: '', address: '' });
      })
      .catch(err => console.error('Add tutor error:', err));
  };

 
  const handleEdit = (id) => setEditingId(id);

 
  const handleSave = (id) => {
    const tutorToUpdate = tutors.find(t => t.id === id);
    fetch(`${API_BASE}/api/tutors/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorToUpdate)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update tutor');
        return res.json();
      })
      .then(updatedTutor => {
        setTutors(tutors.map(t => (t.id === id ? updatedTutor : t)));
        setEditingId(null);
      })
      .catch(err => console.error('Update tutor error:', err));
  };

 
  const handleDelete = (id) => {
    fetch(`${API_BASE}/api/tutors/${id}/`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete tutor');
        setTutors(tutors.filter(t => t.id !== id));
      })
      .catch(err => console.error('Delete tutor error:', err));
  };

  
  const handleFieldEdit = (id, field, value) => {
    setTutors(tutors.map(t => (t.id === id ? { ...t, [field]: value } : t)));
  };

  return (
    <div className="tutors-container">
      <h1>Tutors</h1>
      <table className="tutors-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Assigned Students</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutors.map(tutor => {
            
            const assignedCourses = courses.filter(c => c.tutor === tutor.id);
            
            const assignedStudents = students.filter(s =>
              assignedCourses.some(c => c.id === s.course)
            );

            return (
              <tr key={tutor.id}>
                {editingId === tutor.id ? (
                  <>
                    <td>
                      <input
                        value={tutor.first_name}
                        onChange={e => handleFieldEdit(tutor.id, 'first_name', e.target.value)}
                      />{' '}
                      <input
                        value={tutor.last_name}
                        onChange={e => handleFieldEdit(tutor.id, 'last_name', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={tutor.email}
                        onChange={e => handleFieldEdit(tutor.id, 'email', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={tutor.phone_number}
                        onChange={e => handleFieldEdit(tutor.id, 'phone_number', e.target.value)}
                      />
                    </td>
                    <td>
                      <input value = {tutor.address}
                      onChange= {e=> handleFieldEdit(tutor.id, 'address', e.target.value)}
                      />
                    </td>
                    <td colSpan={2}>
                      <button onClick={() => handleSave(tutor.id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{tutor.first_name} {tutor.last_name}</td>
                    <td>{tutor.email}</td>
                    <td>{tutor.phone_number}</td>
                    <td>{tutor.address}</td>
                    <td>
                      <details>
                        <summary>{assignedStudents.length} Student(s)</summary>
                        <ul>
                          {assignedStudents.map(s => (
                            <li key={s.studentId}>{s.first_name} {s.last_name}</li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(tutor.id)}>Edit</button>{' '}
                      <button onClick={() => handleDelete(tutor.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Add Tutor</h2>
      <div className="add-tutor-form">
        <input
          name="first_name"
          value={newTutor.first_name}
          placeholder="First Name"
          onChange={handleChange}
        />
        <input
          name="last_name"
          value={newTutor.last_name}
          placeholder="Last Name"
          onChange={handleChange}
        />
        <input
          name="email"
          value={newTutor.email}
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name="phone_number"
          value={newTutor.phone_number}
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <input
          name="address"
          value={newTutor.address}
          placeholder="Address"
          onChange={handleChange}
        />
        <button onClick={handleAddTutor}>Add</button>
      </div>
    </div>
  );
}