import React, { useEffect, useState } from 'react';
import './attendance.css';

const API_BASE = 'http://localhost:8000/api';

export default function Attendance() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  
  const [attendanceMarkings, setAttendanceMarkings] = useState({});

  useEffect(() => {
    async function fetchAll() {
      try {
        const [coursesRes, studentsRes, sessionsRes, attendanceRes] = await Promise.all([
          fetch(`${API_BASE}/courses/`),
          fetch(`${API_BASE}/students/`),
          fetch(`${API_BASE}/sessions/`),
          fetch(`${API_BASE}/attendance/`),
        ]);

        if (!coursesRes.ok || !studentsRes.ok || !sessionsRes.ok || !attendanceRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const coursesData = await coursesRes.json();
        const studentsData = await studentsRes.json();
        const sessionsData = await sessionsRes.json();
        const attendanceData = await attendanceRes.json();

        setCourses(coursesData);
        setStudents(studentsData);
        setSessions(sessionsData);
        setAttendanceRecords(attendanceData);

        
        const initialMarkings = {};
        sessionsData.forEach((session) => {
          if (session.status === 'Completed') {
            initialMarkings[session.id] = {};
            attendanceData
              .filter((rec) => rec.session === session.id)
              .forEach((rec) => {
                initialMarkings[session.id][rec.student] = rec.attended;
              });
          }
        });
        setAttendanceMarkings(initialMarkings);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchAll();
  }, []);

  
  const getEnrolledStudents = (courseId) =>
    students.filter((student) => student.course === courseId);

  
  const handleAttendanceChange = (sessionId, studentId, isPresent) => {
    setAttendanceMarkings((prev) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        [studentId]: isPresent,
      },
    }));
  };

  
  const handleSaveAllAttendance = async () => {
    try {
      for (const session of sessions.filter((s) => s.status === 'Completed')) {
        const sessionId = session.id;
        const enrolledStudents = getEnrolledStudents(session.course);
        const existingRecords = attendanceRecords.filter((rec) => rec.session === sessionId);

        for (const student of enrolledStudents) {
          const studentId = student.id;
          const attended = !!attendanceMarkings[sessionId]?.[studentId];
          const existingRecord = existingRecords.find((rec) => rec.student === studentId);

          const payload = {
            session: sessionId,
            student: studentId,
            attended,
          };

          if (existingRecord) {
            await fetch(`${API_BASE}/attendance/${existingRecord.id}/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else {
            await fetch(`${API_BASE}/attendance/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          }
        }
      }

      
      const attendanceRes = await fetch(`${API_BASE}/attendance/`);
      const updatedAttendance = await attendanceRes.json();
      setAttendanceRecords(updatedAttendance);

      alert('All attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance.');
    }
  };

  return (
    <div className="attendance-container">
      <h1>Attendance Management</h1>

      
      <section className="mark-attendance-section">
        <h2>Mark Attendance for Completed Sessions</h2>

        {sessions.filter((s) => s.status === 'Completed').length === 0 && (
          <p>No completed sessions available.</p>
        )}

        {sessions
          .filter((session) => session.status === 'Completed')
          .map((session) => {
            const course = courses.find((c) => c.id === session.course);
            const enrolledStudents = getEnrolledStudents(session.course);
            const sessionAttendance = attendanceMarkings[session.id] || {};

            return (
              <div key={session.id} className="session-container">
                <h3>
                  Session Date: {session.session_date} — Course: {course?.name || 'N/A'}
                </h3>

                {enrolledStudents.length === 0 ? (
                  <p>No students enrolled in this course.</p>
                ) : (
                  <table className="attendance-table session-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Present</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map((student) => (
                        <tr key={student.id}>
                          <td>
                            {student.first_name} {student.last_name}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={!!sessionAttendance[student.id]}
                              onChange={(e) =>
                                handleAttendanceChange(session.id, student.id, e.target.checked)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}

        {sessions.filter((s) => s.status === 'Completed').length > 0 && (
          <button className="save-button" onClick={handleSaveAllAttendance}>
            Save All Attendance
          </button>
        )}
      </section>

      
      <section className="attendance-history-section" style={{ marginTop: '3rem' }}>
        <h2>Attendance History (Read-Only)</h2>

        {sessions.filter((s) => s.status === 'Completed').length === 0 && <p>No completed sessions found.</p>}

        {sessions
          .filter((session) => session.status === 'Completed')
          .map((session) => {
            const course = courses.find((c) => c.id === session.course);
            const enrolledStudents = getEnrolledStudents(session.course);
            const sessionAttendance = attendanceRecords
              .filter((rec) => rec.session === session.id)
              .reduce((acc, rec) => {
                acc[rec.student] = rec.attended;
                return acc;
              }, {});

            return (
              <div key={`history-${session.id}`} className="session-history-container" style={{ marginBottom: '2rem' }}>
                <h3>
                  Session Date: {session.session_date} — Course: {course?.name || 'N/A'}
                </h3>

                {enrolledStudents.length === 0 ? (
                  <p>No students enrolled in this course.</p>
                ) : (
                  <table className="attendance-table history-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map((student) => (
                        <tr key={`history-student-${student.id}`}>
                          <td>
                            {student.first_name} {student.last_name}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {sessionAttendance[student.id] ? (
                              <span style={{ color: 'green' }}>Present</span>
                            ) : (
                              <span style={{ color: 'red' }}>Absent</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
      </section>
    </div>
  );
}