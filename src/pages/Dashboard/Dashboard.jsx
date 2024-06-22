import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPersonCircleCheck } from '@fortawesome/free-solid-svg-icons';

import Charts from '../../components/Charts';
import AdminLayouts from '~/layouts/AdminLayouts';
import axiosInstance from '~/axiosConfig';
import Popup from '~/components/Popup';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const reponse = await axiosInstance.get('reports/pending_reports');
      setReports(reponse.data);
    } catch (error) {
      console.error('Fetch reports error:', error);
    }
  };

  const handleApproveReport = async (reportId) => {
    try {
      await axiosInstance.put(`/reports/${reportId}/approve`);
      fetchReports();
      setMessage('Approve report successfully');
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Approve report error:', error);
    }
  };

  const handleRejectReport = async (reportId) => {
    try {
      await axiosInstance.put(`/reports/${reportId}/reject`);
      fetchReports();
      setMessage('Reject report successfully');
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Reject report error:', error);
    }
  };

  const getFullName = (first_name, last_name) => `${first_name} ${last_name}`;

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const hours = vnDate.getUTCHours().toString().padStart(2, '0');
    const minutes = vnDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = vnDate.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <AdminLayouts>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3">
                Reason
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 ">
                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <img
                    src={
                      report.user.avatar_url
                        ? `http://127.0.0.1/${report.user.avatar_url}`
                        : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg'
                    }
                    className="w-10 h-10 rounded-full"
                    alt="Author"
                    width={40}
                    height={40}
                  />

                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {getFullName(report.user.first_name, report.user.last_name)}
                    </div>
                    <div className="font-normal text-gray-500">{report.user.email}</div>
                  </div>
                </th>
                <td className="px-6 py-4 text-base">{report.date}</td>
                <td className="px-6 py-4 text-base">{formatTime(report.time_check)}</td>
                <td className="px-6 py-4 text-base">{report.reason}</td>
                <td className="px-6 py-4 text-base">
                  <button
                    onClick={() => handleApproveReport(report.id)}
                    className="mr-3 bg-primary-700  dark:bg-primary-500 text-gray-100 dark:text-gray-200 rounded px-4 py-2 text-center"
                  >
                    <FontAwesomeIcon icon={faPersonCircleCheck} className="pr-3" />
                    Approved
                  </button>
                  <button
                    onClick={() => handleRejectReport(report.id)}
                    className="bg-red-500 dark:bg-red-600 text-gray-100 dark:text-gray-100 rounded px-4 py-2 text-center"
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="pr-3" />
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-0 left-0 z-50 flex justify-center items-center p-4"
          >
            <Popup children={message} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <Charts />
      </div>
    </AdminLayouts>
  );
};

export default Dashboard;
