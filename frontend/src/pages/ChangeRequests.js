import React, { useEffect, useState } from 'react';
import './ChangeRequests.css';

const API_BASE = 'http://localhost:8000/api';

export default function ChangeRequests() {
    const [requests, setRequests] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // form state
    const [newReq, setNewReq] = useState({
        submittedBy: '',
        course: '',
        changeType: '',
        status: 'Pending'
    });

    useEffect(() => {
        fetch(`${API_BASE}/change-requests/`).then(res => res.json()).then(setRequests);
        fetch(`${API_BASE}/courses/`).then(res => res.json()).then(setCourses);
        fetch(`${API_BASE}/students/`).then(res => res.json()).then(setStudents);
    }, []);

    const handleFieldEdit = (id, field, value) => {
        setRequests(prev => prev.map(r => r.change_id === id ? { ...r, [field]: value } : r));
    };

    const handleSave = id => {
        const req = requests.find(r => r.change_id === id);
        fetch(`${API_BASE}/change-requests/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...req,
                submittedBy: parseInt(req.submittedBy),
                course: parseInt(req.course)
            })
        })
            .then(res => res.json())
            .then(updated => {
                setRequests(prev => prev.map(r => r.change_id === id ? updated : r));
                setEditingId(null);
            });
    };

    const handleDelete = id => {
        fetch(`${API_BASE}/change-requests/${id}/`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) setRequests(prev => prev.filter(r => r.change_id !== id));
            });
    };

    const handleAdd = e => {
        e.preventDefault();
        fetch(`${API_BASE}/change-requests/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newReq,
                submittedBy: parseInt(newReq.submittedBy),
                course: parseInt(newReq.course)
            })
        })
            .then(res => res.json())
            .then(data => {
                setRequests(prev => [...prev, data]);
                setNewReq({ submittedBy: '', course: '', changeType: '', status: 'Pending' });
            });
    };

    return (
        <div className="changerequests-container">
            <h1>Change Requests</h1>

            <table className="changerequests-table">
                <thead>
                <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {requests.map(req => {
                    const student = students.find(s => s.id === req.submittedBy);
                    const course = courses.find(c => c.id === req.course);
                    return (
                        <tr key={req.change_id}>
                            {editingId === req.change_id ? (
                                <>
                                    <td>
                                        <select value={req.submittedBy} onChange={e => handleFieldEdit(req.change_id, 'submittedBy', e.target.value)}>
                                            <option value="">Select</option>
                                            {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <select value={req.course} onChange={e => handleFieldEdit(req.change_id, 'course', e.target.value)}>
                                            <option value="">Select</option>
                                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <select value={req.changeType} onChange={e => handleFieldEdit(req.change_id, 'changeType', e.target.value)}>
                                            <option value="Add">Add</option>
                                            <option value="Drop">Drop</option>
                                            <option value="Swap">Swap</option>
                                        </select>
                                    </td>
                                    <td>{req.status}</td>
                                    <td>
                                        <button onClick={() => handleSave(req.change_id)}>Save</button>
                                        <button onClick={() => setEditingId(null)}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{student ? `${student.first_name} ${student.last_name}` : 'Unknown'}</td>
                                    <td>{course ? course.name : 'Unknown'}</td>
                                    <td>{req.changeType}</td>
                                    <td>{req.status}</td>
                                    <td>
                                        <button onClick={() => setEditingId(req.change_id)}>Edit</button>
                                        <button onClick={() => handleDelete(req.change_id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <h2>Add Request</h2>
            <form className="add-request-form" onSubmit={handleAdd}>
                <select name="submittedBy" value={newReq.submittedBy} onChange={e => setNewReq({ ...newReq, submittedBy: e.target.value })}>
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
                <select name="course" value={newReq.course} onChange={e => setNewReq({ ...newReq, course: e.target.value })}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="changeType" value={newReq.changeType} onChange={e => setNewReq({ ...newReq, changeType: e.target.value })}>
                    <option value="">Select Type</option>
                    <option value="Add">Add</option>
                    <option value="Drop">Drop</option>
                    <option value="Swap">Swap</option>
                </select>
                <button type="submit">Add</button>
            </form>
        </div>
    );
}