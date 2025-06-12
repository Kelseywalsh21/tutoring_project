import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]); // all sessions for selected day

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionsRes, coursesRes, studentsRes] = await Promise.all([
          fetch(`${API_BASE}/scheduledsession/`),
          fetch(`${API_BASE}/courses/`),
          fetch(`${API_BASE}/students/`),
        ]);
        if (!sessionsRes.ok || !coursesRes.ok || !studentsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const sessionsData = await sessionsRes.json();
        const coursesData = await coursesRes.json();
        const studentsData = await studentsRes.json();

        setSessions(sessionsData);
        setCourses(coursesData);
        setStudents(studentsData);

        const mappedEvents = sessionsData.map((session) => {
          const course = coursesData.find((c) => c.id === session.course);
          const startDate = parseLocalDate(session.sessionDate);
          return {
            id: session.id,
            title: course ? course.name : 'Unknown Course',
            start: startDate,
            end: startDate,
            resource: session,
          };
        });

        setEvents(mappedEvents);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const parseLocalDate = (dateString) => {
    const parts = dateString.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  const handleSelectSlot = ({ start }) => {
    // Format date to YYYY-MM-DD for comparison
    const clickedDateStr = start.toISOString().slice(0, 10);

    // Filter sessions that match clicked date
    const sessionsOnDate = sessions.filter(session => session.sessionDate === clickedDateStr);

    setSelectedSessions(sessionsOnDate);
  };

  // For each selected session, find enrolled students
  const enrolledStudentsBySession = selectedSessions.map(session => {
    const enrolled = students.filter(student => student.course === session.course);
    return { session, enrolled };
  });

  const eventStyleGetter = (event) => {
    const status = event.resource.status;
    let backgroundColor = '#3174ad'; // default react-big-calendar blue

    if (status === 'Completed') {
      backgroundColor = '#add8e6'; // light blue
    } else if (status === 'Cancelled') {
      backgroundColor = '#f08080'; // light red
    }

    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
    };

    return { style };
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Upcoming Sessions</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh' }}
        onSelectSlot={handleSelectSlot}
        selectable={true}
        views={['month', 'week', 'day']}
        defaultView="month"
        toolbar={true}
        eventPropGetter={eventStyleGetter}
      />

{selectedSessions.length > 0 && (
  <section
    style={{
      marginTop: '2rem',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    }}
  >
    <h2>Sessions on {selectedSessions[0].sessionDate}</h2>

    {enrolledStudentsBySession.map(({ session, enrolled }) => (
      <div
        key={session.id}
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          border: '1px solid #bbb',
          borderRadius: '6px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <p>
          <strong>Course:</strong> {courses.find(c => c.id === session.course)?.name || 'Unknown Course'}
        </p>
        <p>
          <strong>Status:</strong> {session.status}
        </p>
        <p>
          <strong>Session ID:</strong> {session.id}
        </p>

        <h4>Enrolled Students ({enrolled.length}):</h4>
        {enrolled.length === 0 ? (
          <p>No students enrolled.</p>
        ) : (
          <ul>
            {enrolled.map(student => (
              <li key={student.id}>{student.firstName} {student.lastName}</li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </section>
)}
    </div>
  );
}
