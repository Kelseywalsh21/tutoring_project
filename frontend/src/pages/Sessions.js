import { useState, useEffect } from 'react';
import './sessions.css';
const API_BASE = 'http://localhost:8000';

export default function ScheduledSessions() {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [newSession, setNewSession] = useState({
    course: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    location: '',
    status: '',   
    approved: false
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/scheduledsession/`)
      .then(res => res.json())
      .then(data => {
        const updatedSessions = data.map(session => ({
          ...session,
          status: computeStatus(session)
        }));
        setSessions(updatedSessions);
      })
      .catch(err => console.error('Error fetching sessions:', err));

    fetch(`${API_BASE}/api/courses/`)
      .then(res => res.json())
      .then(setCourses)
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  
  useEffect(() => {
    if (newSession.sessionDate && newSession.endTime) {
      const computedStatus = computeStatus(newSession);
      setNewSession(prev => ({ ...prev, status: computedStatus }));
    } else {
      setNewSession(prev => ({ ...prev, status: '' }));
    }
  }, [newSession.sessionDate, newSession.endTime]);


  const handleSave = (id) => {
    const session = sessions.find(s => s.id === id);
    const updatedStatus = computeStatus(session);

    fetch(`${API_BASE}/api/scheduledsession/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...session,
        course: parseInt(session.course),
        status: session.status === 'Cancelled' ? 'Cancelled' : updatedStatus
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update session');
        return res.json();
      })
      .then(updated => {
        setSessions(sessions.map(s => s.id === id ? { ...updated, status: computeStatus(updated) } : s));
        setEditingId(null);
      })
      .catch(err => console.error('Update session error:', err));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sessions.forEach(session => {
        const updatedStatus = computeStatus(session);
        if (session.status !== updatedStatus && session.status !== 'Cancelled') {
          // Call your existing handleSave function here
          handleSave({
            ...session,
            status: updatedStatus,
            course: parseInt(session.course),
          });
        }
      });
    }, 60000);
  
    return () => clearInterval(interval);
  }, [sessions, handleSave]);

  

  
  const computeStatus = (session) => {
    if (session.status === 'Cancelled') {
      return 'Cancelled';
    }

    if (!session.sessionDate || !session.endTime) {
      return '';
    }

    const [year, month, day] = session.sessionDate.split('-').map(Number);
    const [hour, minute] = session.endTime.split(':').map(Number);
    const sessionEndDateTime = new Date(year, month - 1, day, hour, minute, 0);
    const now = new Date();

    return now > sessionEndDateTime ? 'Completed' : 'Scheduled';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSession(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSession = () => {
    fetch(`${API_BASE}/api/scheduledsession/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newSession,
        course: parseInt(newSession.course),
        
        status: newSession.status || 'Scheduled'
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add session');
        return res.json();
      })
      .then(session => {
        setSessions([...sessions, { ...session, status: computeStatus(session) }]);
        setNewSession({
          course: '',
          sessionDate: '',
          startTime: '',
          endTime: '',
          location: '',
          status: '',
          approved: false
        });
      })
      .catch(err => console.error('Add session error:', err));
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE}/api/scheduledsession/${id}/`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete session');
        setSessions(sessions.filter(s => s.id !== id));
      })
      .catch(err => console.error('Delete session error:', err));
  };

  const handleEdit = (id) => setEditingId(id);

  

  const handleFieldEdit = (id, field, value) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const toggleCancelStatus = (session) => {
    const newStatus = session.status === 'Cancelled' ? 'Scheduled' : 'Cancelled';

    setSessions(sessions.map(s =>
      s.id === session.id ? { ...s, status: newStatus } : s
    ));

    fetch(`${API_BASE}/api/scheduledsession/${session.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...session,
        status: newStatus,
        course: parseInt(session.course)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
      })
      .then(updated => {
        setSessions(sessions.map(s => s.id === updated.id ? updated : s));
      })
      .catch(err => console.error('Update status error:', err));
  };

  return (
    <div className="scheduled-sessions-container">
      <h1>Scheduled Sessions</h1>

      <table className="sessions-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Location</th>
            <th>Status</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              {editingId === session.id ? (
                <>
                  <td>
                    <select
                      value={session.course}
                      onChange={(e) => handleFieldEdit(session.id, 'course', parseInt(e.target.value))}
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="date"
                      value={session.sessionDate}
                      onChange={(e) => handleFieldEdit(session.id, 'sessionDate', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={session.startTime}
                      onChange={(e) => handleFieldEdit(session.id, 'startTime', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={session.endTime}
                      onChange={(e) => handleFieldEdit(session.id, 'endTime', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={session.location}
                      onChange={(e) => handleFieldEdit(session.id, 'location', e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => toggleCancelStatus(session)}>
                      {session.status === 'Cancelled' ? 'Re-Schedule' : 'Cancel'}
                    </button>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={session.approved}
                      onChange={(e) => handleFieldEdit(session.id, 'approved', e.target.checked)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(session.id)}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{courses.find((c) => c.id === session.course)?.name || 'N/A'}</td>
                  <td>{session.sessionDate}</td>
                  <td>{session.startTime}</td>
                  <td>{session.endTime}</td>
                  <td>{session.location}</td>
                  <td>{session.status}</td>
                  <td>{session.approved ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleEdit(session.id)}>Edit</button>
                    <button onClick={() => handleDelete(session.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add Session</h2>
      <div className="add-session-form">
        <select name="course" value={newSession.course} onChange={handleChange}>
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <input name="sessionDate" type="date" value={newSession.sessionDate} onChange={handleChange} />
        <input name="startTime" type="time" value={newSession.startTime} onChange={handleChange} />
        <input name="endTime" type="time" value={newSession.endTime} onChange={handleChange} />
        <input name="location" placeholder="Location" value={newSession.location} onChange={handleChange} />
        <label>
          Approved:
          <input name="approved" type="checkbox" checked={newSession.approved} onChange={handleChange} />
        </label>
        <button onClick={handleAddSession}>Add</button>
      </div>
    </div>
  );
}