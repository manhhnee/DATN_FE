import dayjs from 'dayjs';
import React, { useContext, useState, useEffect } from 'react';
import GlobalContext from '~/context/GlobalContext';
import axiosInstance from '~/axiosConfig';

function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const { setDaySelected, setShowEventModal, filteredEvents, setSelectedEvent, userId, isLoggedIn } =
    useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter((evt) => dayjs(evt.day).format('DD-MM-YY') === day.format('DD-MM-YY'));
    setDayEvents(events);
  }, [filteredEvents, day]);

  useEffect(() => {
    const fetchDate = async () => {
      if (isLoggedIn && userId) {
        const response = await axiosInstance.get(`/users/${userId}/attendances/user_attendances`);
        setAttendanceData(response.data);
      }
    };
    fetchDate();
  }, [userId, isLoggedIn]);

  function getCurrentDayClass() {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY') ? 'bg-blue-600 text-white rounded-full w-7' : '';
  }

  function workTime() {
    const dateString = day.format('YYYY-MM-DD');
    if (attendanceData.hasOwnProperty(dateString)) {
      const { time_worked } = attendanceData[dateString];
      return time_worked >= 8 ? 'bg-green-400 dark:bg-green-600' : 'bg-red-400 dark:bg-red-800';
    }
    return '';
  }

  return (
    <div
      className={`border border-gray flex flex-col border-stroke bg-white shadow-default ${workTime()} dark:bg-black`}
    >
      <header className="flex flex-col items-center dark:text-white">
        {rowIdx === 0 && <p className="text-sm mt-1">{day.format('ddd').toUpperCase()}</p>}
        <p className={`text-sm p-1 my-1 text-center dark:text-white ${getCurrentDayClass()}`}>{day.format('DD')}</p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {dayEvents.map((evt, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedEvent(evt)}
            className={`bg-${evt.label}-200 p-1 text-gray-3 text-sm rounded mb-1 truncate`}
          >
            {evt.title}
          </div>
        ))}
        <footer className="text-center text-xs mt-16">
          {attendanceData.hasOwnProperty(day.format('YYYY-MM-DD')) && (
            <>
              <p className="mb-1 text-sm dark:text-gray-100">
                Worked: {attendanceData[day.format('YYYY-MM-DD')].time_worked} hours
              </p>
              <p className="text-gray-600 text-sm dark:text-red-700">
                Missing: {attendanceData[day.format('YYYY-MM-DD')].missing_time} hours
              </p>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

export default Day;
