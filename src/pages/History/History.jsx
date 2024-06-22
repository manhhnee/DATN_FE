import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from '~/context/GlobalContext';
import axiosInstance from '~/axiosConfig/axiosConfig';

const History = () => {
  const [attendances, setAttendances] = useState({});
  const { userId } = useContext(GlobalContext);

  useEffect(() => {
    const fetchAttendanceByID = async () => {
      try {
        if (userId) {
          const response = await axiosInstance.get(`/users/${userId}/attendances/user_attendances`);
          console.log(response.data);
          setAttendances(response.data);
        }
      } catch (error) {
        console.error("Fetch user's attendance error:", error);
      }
    };

    fetchAttendanceByID();
  }, [userId]);
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const hours = vnDate.getUTCHours().toString().padStart(2, '0');
    const minutes = vnDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = vnDate.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-full p-3 dark:bg-slate-600">
      <table className="w-full text-sm text-left text-gray-500 shadow-6">
        <thead className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Time check in</th>
            <th className="px-6 py-3">Time check out</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(attendances).map(([date, { check_in, check_out }]) => (
            <tr key={date} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
              <td className="px-6 py-4 font-medium whitespace-nowrap">{date}</td>
              <td className="px-6 py-4">{formatTime(check_in)}</td>
              <td className="px-6 py-4">{formatTime(check_out)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
