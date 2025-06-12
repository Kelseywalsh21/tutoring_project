import React, { useEffect, useState } from 'react';
import './Tests.css';

const API_BASE = 'http://localhost:8000/api';

export default function Tests() {
    const [tests, setTests] = useState([]);
    const [students, setStudents] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newTest, setNewTest] = useState({ student: '', date: '', score: '', description: '' });

    useEffect(() => {
        fetch(`${API_BASE}/tests/`).then(res => res.json()).then(setTests);
        fetch(`${API_BASE}/students/`).then(res => res.json()).then(setStudents);
    }, []);

    const handleFieldEdit = (id, field, value) => {
        setTests(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleSave = id => {
        const tst = tests.find(t => t.id === id);
        fetch(`${API_BASE}/tests/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...tst, student: parseInt(tst.student) })
        })
            .then(res => res.json())
            .then(updated => {
                setTests(prev => prev.map(t => t.id === id ? updated : t));
                setEditingId(null);
            });
    };

    const handleDelete = id => {
        fetch(`${API_BASE}/tests/${id}/`, { method: 'DELETE' })
            .then(res => { if (res.ok) setTests(prev => prev.filter(t => t.id !== id)); });
    };

    const handleAdd = e => {
        e.preventDefault();
        fetch(`${API_BASE}/tests/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newTest, student: parseInt(newTest.student) })
        })
            .then(res => res.json())
            .then(data => {
                setTests(prev => [...prev, data]);
                setNewTest({ student: '', date: '', score: '', description: '' });
            });
    };

    return (
        <div className="tests-container">
            <h1>Test Records</h1>

            <table className="tests-table">
                <thead>
                <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tests.map(test => {
                    const student = students.find(s => s.id === test.student);
                    return (
                        <tr key={test.id}>
                            {editingId === test.id ? (
                                <>
                                    <td>
                                        <select value={test.student} onChange={e => handleFieldEdit(test.id, 'student', e.target.value)}>
                                            <option value="">Select</option>
                                            {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                                        </select>
                                    </td>
                                    <td><input type="date" value={test.date} onChange={e => handleFieldEdit(test.id, 'date', e.target.value)} /></td>
                                    <td><input type="number" value={test.score} onChange={e => handleFieldEdit(test.id, 'score', e.target.value)} /></td>
                                    <td><input type="text" value={test.description} onChange={e => handleFieldEdit(test.id, 'description', e.target.value)} /></td>
                                    <td>
                                        <button onClick={() => handleSave(test.id)}>Save</button>
                                        <button onClick={() => setEditingId(null)}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{student ? `${student.first_name} ${student.last_name}` : 'Unknown'}</td>
                                    <td>{test.date}</td>
                                    <td>{test.score}</td>
                                    <td>{test.description}</td>
                                    <td>
                                        <button onClick={() => setEditingId(test.id)}>Edit</button>
                                        <button onClick={() => handleDelete(test.id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <h2>Add Test</h2>
            <form className="add-test-form" onSubmit={handleAdd}>
                <select name="student" value={newTest.student} onChange={e => setNewTest(prev => ({ ...prev, student: e.target.value }))}>
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
                <input type="date" name="date" value={newTest.date} onChange={e => setNewTest(prev => ({ ...prev, date: e.target.value }))} />
                <input type="number" name="score" placeholder="Score" value={newTest.score} onChange={e => setNewTest(prev => ({ ...prev, score: e.target.value }))} />
                <input type="text" name="description" placeholder="Description" value={newTest.description} onChange={e => setNewTest(prev => ({ ...prev, description: e.target.value }))} />
                <button type="submit">Add</button>
            </form>
        </div>
    );
}