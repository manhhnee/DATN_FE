import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Breadcrumb from '~/components/Breadcrumbs';
import AdminLayouts from '~/layouts/AdminLayouts/AdminLayouts';
import axiosInstance from '~/axiosConfig/axiosConfig';
import Popup from '~/components/Popup';
import config from '~/config';

const AccountManagement = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState();
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState([]);
  const [attendances, setAttendances] = useState({});
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccess2, setShowSuccess2] = useState(false);
  const [showSuccess3, setShowSuccess3] = useState(false);

  const [formData2, setFormData2] = useState({
    email: '',
    password: '',
    department_id: '1',
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    avatar: null,
    basic_salary: '',
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axiosInstance.get('/departments');
      if (response.data && response.data.data) {
        setDepartments(response.data.data);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchAttendanceByID = async () => {
      try {
        if (userId) {
          const response = await axiosInstance.get(`/users/${userId}/attendances`);
          console.log(response.data);
          setAttendances(response.data);
        }
      } catch (error) {
        console.error("Fetch user's attendance error:", error);
      }
    };

    fetchAttendanceByID();
  }, [userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axiosInstance.get('/users');
      if (response.data && response.data.data) {
        setUserData(response.data.data);
      }
    };
    fetchUsers();
  }, []);

  const getFullName = (first_name, last_name) => `${first_name} ${last_name}`;

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    for (const key in formData2) {
      if (formData2[key]) {
        updateData.append(key, formData2[key]);
      }
    }
    try {
      const response = await axiosInstance.post('/users', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.user && response.data.user.id) {
        const userId = response.data.user.id;
        navigate(`${config.routes.capture.replace(':user_id', userId)}`);
      }
      setIsModalOpen1(false);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Create usererror:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      const response = await axiosInstance.get('/users');
      setUserData(response.data.data);
      setIsModalOpen3(false);
      setShowSuccess3(true);

      setTimeout(() => setShowSuccess3(false), 3000);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log(error.response.data);
      } else {
        console.error('Delete user error:', error);
      }
    }
  };

  const handleTrainData = async () => {
    try {
      const reponse = await axiosInstance.post('/train_classifier');
      console.log(reponse.data);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log(error.response.data);
      } else {
        console.error('Train data user error:', error);
      }
    }
  };

  const calculateSalary = async (userId) => {
    try {
      const response = await axiosInstance.post('/salaries', {
        salary: {
          user_id: userId,
        },
      });
      setIsModalOpen2(false);
      setShowSuccess2(true);

      setTimeout(() => setShowSuccess2(false), 3000);
      console.log('Salary calculation response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('Error response:', error.response.data);
      } else {
        console.error('Calculate salary error:', error);
      }
    }
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({
      ...formData2,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    const selectedDepartmentId = e.target.value;
    setFormData2({
      ...formData2,
      department_id: selectedDepartmentId,
    });
  };

  const openModal1 = () => {
    setIsModalOpen1(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };

  const openModal3 = (user_id) => {
    setUserId(user_id);
    setIsModalOpen3(true);
  };

  const handleViewAttendance = (user_id) => {
    setUserId(user_id);
    setIsModalOpen2(true);
  };

  const closeModal3 = () => {
    setIsModalOpen3(false);
  };

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
      <Breadcrumb pageName={'Account-Management'} />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">List Account</h4>
          {/* <button
            type="button"
            onClick={handleTrainData}
            className="ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="fill-current mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Train data
          </button> */}
          <button
            type="button"
            onClick={openModal1}
            className="ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="fill-current mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add account
          </button>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Email</p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Name</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Phone number</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Date of birth</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Action</p>
          </div>
        </div>

        {userData.map((user, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-black dark:text-white">{user.email}</p>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">{getFullName(user.first_name, user.last_name)}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">{user.phone_number}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">{user.date_of_birth}</p>
            </div>
            <div className="flex border-[#eee]  dark:border-strokedark">
              <div className="flex space-x-3.5">
                <button onClick={() => openModal3(user.id)} className="hover:text-primary-600">
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                      fill=""
                    />
                    <path
                      d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                      fill=""
                    />
                    <path
                      d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                      fill=""
                    />
                    <path
                      d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                      fill=""
                    />
                  </svg>
                </button>
                {/* Open modal delete User */}
                {isModalOpen3 && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.3 }}
                      className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden"
                    >
                      <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg">
                          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Delete</h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete this item?
                          </p>
                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded px-4 py-2"
                              onClick={closeModal3}
                            >
                              Cancel
                            </button>
                            <button className="bg-red-600 text-white rounded px-4 py-2" onClick={handleConfirmDelete}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
                {/*Handle view Attendance by UserID */}
                <button onClick={() => handleViewAttendance(user.id)} className="hover:text-primary-600">
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </button>
                {/* Open modal view Attendance by UserID */}
                {isModalOpen2 && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.3 }}
                      className="fixed top-1/3 left-1/3  z-50 bg-white shadow-1 w-180 rounded-lg overflow-auto"
                    >
                      <div className="p-4">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th className="px-6 py-3">Date</th>
                              <th className="px-6 py-3">Time check in</th>
                              <th className="px-6 py-3">Time check out</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(attendances).map(([date, { check_in, check_out }]) => (
                              <tr key={date} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium whitespace-nowrap">{date}</td>
                                <td className="px-6 py-4">{formatTime(check_in)}</td>
                                <td className="px-6 py-4">{formatTime(check_out)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="pb-4 pr-4 border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                        <button
                          className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded px-4 py-2"
                          onClick={closeModal2}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-blue-500 text-white rounded px-4 py-2"
                          onClick={() => calculateSalary(user.id)}
                        >
                          Calculator Salary
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        ))}

        <AnimatePresence>
          {isModalOpen1 && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden"
            >
              <div
                id="authentication-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden"
              >
                <div className="relative p-4 w-full max-w-md max-h-full mx-auto mt-20">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create Account</h3>
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={closeModal1}
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 1"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    <div className="p-4">
                      <form className="space-y-4" onSubmit={handleCreateAccount}>
                        <div>
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData2.email}
                            onChange={handleInputChange2}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter password
                          </label>
                          <input
                            type="text"
                            name="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData2.password}
                            onChange={handleInputChange2}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="first_name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter first name
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData2.first_name}
                            onChange={handleInputChange2}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="last_name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter last name
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData2.last_name}
                            onChange={handleInputChange2}
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone_number"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter phone number
                          </label>
                          <input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData2.phone_number}
                            onChange={handleInputChange2}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="date_of_birth"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter date of birth
                          </label>
                          <input
                            type="date"
                            name="date_of_birth"
                            id="date_of_birth"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData2.date_of_birth}
                            onChange={handleInputChange2}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="basic_salary"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter basic salary
                          </label>
                          <input
                            type="text"
                            name="basic_salary"
                            id="basic_salary"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData2.basic_salary}
                            onChange={handleInputChange2}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="department"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Select Department
                          </label>
                          <select
                            name="department"
                            id="department"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData2.department_id}
                            onChange={handleSelectChange}
                            required
                          >
                            {departments.map((department) => (
                              <option key={department.id} value={department.id}>
                                {department.department_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Create Account
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 right-0 left-0 z-50 flex justify-center items-center p-4"
            >
              <Popup icon={<FontAwesomeIcon icon={faCheckCircle} />} children={'Create user succesfully !'} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSuccess2 && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 right-0 left-0 z-50 flex justify-center items-center p-4"
            >
              <Popup icon={<FontAwesomeIcon icon={faCheckCircle} />} children={'Caculator salary successfully !'} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSuccess3 && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 right-0 left-0 z-50 flex justify-center items-center p-4"
            >
              <Popup icon={<FontAwesomeIcon icon={faCheckCircle} />} children={'Delete user successfully !'} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayouts>
  );
};

export default AccountManagement;
