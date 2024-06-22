import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faNoteSticky, faSpinner } from '@fortawesome/free-solid-svg-icons';

import GlobalContext from '~/context/GlobalContext';
import axiosInstance from '~/axiosConfig';
import Popup from '~/components/Popup';

const Report = () => {
  const { userId } = useContext(GlobalContext);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [attendanceTypes, setAttendanceTypes] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    attendance_type_id: '1',
    time_check: '',
    reason: '',
  });

  useEffect(() => {
    fetchReport();
    fetchAttendanceTypes();
  }, []);

  const fetchReport = async () => {
    try {
      if (userId) {
        const reponse = await axiosInstance.get(`/users/${userId}/reports`);
        setReports(reponse.data);
      }
    } catch (error) {
      console.error('Fetch report error:', error);
    }
  };

  const fetchAttendanceTypes = async () => {
    try {
      const reponse = await axiosInstance.get(`attendance_types`);
      setAttendanceTypes(reponse.data);
    } catch (error) {
      console.error('Fetch attendance types error:', error);
    }
  };

  const handleCreateReport = async () => {
    try {
      const localDateTimeString = `${formData.date}T${formData.time_check}:00`;
      const localDateTime = new Date(localDateTimeString);

      if (isNaN(localDateTime)) {
        setMessage('Invalid time value');
        setShowSuccess(true);
        return;
      }

      const utcDateTimeString = localDateTime.toISOString();

      await axiosInstance.post(
        `/users/${userId}/reports`,
        {
          report: {
            date: formData.date,
            attendance_type_id: formData.attendance_type_id,
            time_check: utcDateTimeString,
            reason: formData.reason,
          },
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setMessage('Create report successfully');
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Create report error:', error);
    }
  };

  const handleSelectChange = (e) => {
    const selectedAttendanceTypeId = e.target.value;
    setFormData({
      ...formData,
      attendance_type_id: selectedAttendanceTypeId,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setFormData({
      date: '',
      attendance_type_id: '',
      time_check: '',
      reason: '',
    });
  };

  return (
    <div className="w-full p-3 dark:bg-slate-600">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Report Information</h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleCreateReport}>
                <div className="mb-5.5">
                  <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Enter date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    htmlFor="attendance_type"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Attendance Type
                  </label>
                  <select
                    name="attendance_type"
                    id="attendance_type"
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={formData.attendance_type_id}
                    onChange={handleSelectChange}
                    required
                  >
                    {attendanceTypes.map((attendanceType) => (
                      <option key={attendanceType.id} value={attendanceType.id}>
                        {attendanceType.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-5.5">
                  <label htmlFor="time_check" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Enter time
                  </label>
                  <input
                    type="time"
                    name="time_check"
                    id="time_check"
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={formData.time_check}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="Username">
                    Reason
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <FontAwesomeIcon icon={faNoteSticky} />
                    </span>

                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-gray-200 dark:focus:border-primary"
                      name="reason"
                      id="reason"
                      rows={6}
                      placeholder="Enter reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 dark:text-gray-200"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center py-6 px-4 md:px-6 xl:px-7.5">
              <h4 className="text-xl font-semibold text-black dark:text-white ">List Report</h4>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark dark:text-gray-200 sm:grid-cols-8 md:px-6 2xl:px-7.5">
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Date</p>
              </div>
              <div className="col-span-4 hidden items-center sm:flex">
                <p className="font-medium">Reason</p>
              </div>
              <div className="col-span-1 hidden items-center sm:flex">
                <p className="font-medium">Status</p>
              </div>
            </div>
            {reports.map((report, key) => {
              return (
                <div
                  className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                  key={key}
                >
                  <div className="col-span-2 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <p className="text-base text-black dark:text-white">{report.date}</p>
                    </div>
                  </div>
                  <div className="col-span-4 flex items-center">
                    <p className="text-base text-black dark:text-white">{report.reason}</p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-base text-black dark:text-white">
                      {report.approved ? (
                        <FontAwesomeIcon icon={faCheckCircle} />
                      ) : (
                        <FontAwesomeIcon icon={faSpinner} spinPulse />
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
      </div>
    </div>
  );
};

export default Report;
