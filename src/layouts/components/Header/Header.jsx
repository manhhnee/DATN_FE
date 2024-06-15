import dayjs from 'dayjs';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import logo from '~/assets/logo.png';
import GlobalContext from '~/context/GlobalContext';
import axiosInstance from '~/axiosConfig/axiosConfig';
import routes from '~/config/routes';
import DarkModeSwitcher from '~/layouts/components/Admin/Header/DarkModeSwitcher';
import Popup from '~/components/Popup';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userId, setUserId, setRole, monthIndex, setMonthIndex } =
    useContext(GlobalContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (isLoggedIn) {
          const response = await axiosInstance.get(`/users/${userId}`);
          setUserInfo(response.data.data);
        }
      } catch (error) {
        console.error('Fetch user info error:', error);
      }
    };
    fetchUserInfo();
  }, [userId, isLoggedIn]);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month());
  }

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  function getAllName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  const handleLogout = async () => {
    try {
      await axiosInstance.delete('/logout');
      setIsLoggedIn(false);
      setRole('');
      setUserId('');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckInOut = async () => {
    try {
      const timeNow = dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
      console.log(timeNow);

      if (!checkInTime) {
        // Check-in
        setCheckInTime(timeNow);
        await axiosInstance.post(`/users/${userId}/attendances`, {
          date: dayjs().format('YYYY-MM-DD'),
          time_check: timeNow,
          attendance_type_id: 1, // Assuming 1 is the ID for check-in
        });
        setMessage('Check-in successfully!');
      } else {
        // Check-out
        setCheckOutTime(timeNow);
        await axiosInstance.post(`/users/${userId}/attendances`, {
          date: dayjs().format('YYYY-MM-DD'),
          time_check: timeNow,
          attendance_type_id: 2, // Assuming 2 is the ID for check-out
        });
        setMessage('Check-out successfully!');
      }

      closeModal();
    } catch (error) {
      console.error('Check-in/out error:', error);
    }
  };

  const handleCheckInOutToRecognize = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    try {
      const response = await axiosInstance.post('/recognize', {
        image: imageSrc,
      });
      const { message, output } = response.data;
      console.log(message);
      console.log(output);

      if (output) {
        const user_id = output.toString().trim();
        const timeNow = dayjs().format('YYYY-MM-DDTHH:mm:ssZ');

        if (!checkInTime) {
          setCheckInTime(timeNow);
          await axiosInstance.post(`/users/${user_id}/attendances/create_to_recognize`, {
            date: dayjs().format('YYYY-MM-DD'),
            time_check: timeNow,
            attendance_type_id: 1,
          });
          setMessage('Check-in successfully!');
        } else {
          setCheckOutTime(timeNow);
          await axiosInstance.post(`/users/${user_id}/attendances/create_to_recognize`, {
            date: dayjs().format('YYYY-MM-DD'),
            time_check: timeNow,
            attendance_type_id: 2,
          });
          setMessage('Check-out successfully!');
        }
      } else {
        setMessage('No face detected');
      }

      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);

      closeModal();
    } catch (error) {
      console.error('Face recognition error:', error);
    }
  };

  return (
    <header className="px-4 py-2 flex items-center justify-center dark:bg-boxdark dark:drop-shadow-none">
      <img src={logo} alt="calendar" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-500 font-bold dark:text-gray-200">Calendar</h1>
      <button onClick={handleReset} className={cx('btn-today')}>
        Today
      </button>

      <button dir="ltr" onClick={handlePrevMonth} className="rounded-s-lg hover:bg-gray-200 dark:hover:bg-black">
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2 dark:text-white">chevron_left</span>
      </button>
      <button dir="rtl" onClick={handleNextMonth} className="rounded-s-lg hover:bg-gray-200 dark:hover:bg-black">
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2 dark:text-white">chevron_right</span>
      </button>
      <h2 className="mt-auto mb-auto text-xl ml-3 text-gray-500 font-bold dark:text-gray-300">
        {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
      </h2>

      {isLoggedIn ? (
        <div className="ml-auto relative flex">
          <button className={cx('btn-check')} onClick={handleCheckInOut}>
            {checkInTime ? 'Check Out' : 'Check In'}
          </button>
          <button
            id="dropdownInformationButton"
            onClick={toggleDropdown}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            User account{' '}
            <svg
              className="w-2.5 h-2.5 ml-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              id="dropdownInformation"
              className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>{getAllName(userInfo.first_name, userInfo.last_name)}</div>
                <div className="font-medium truncate">{userInfo.email}</div>
              </div>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
                <li>
                  <Link
                    to={routes.home}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={routes.profile}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Profiles
                  </Link>
                </li>
              </ul>
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="size-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="ml-auto flex gap-4 items-center">
          <button onClick={openModal} className={cx('btn-check')}>
            Check
          </button>
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="fixed top-80 left-0 w-full h-full z-50 flex justify-center items-center"
              >
                <div
                  id="authentication-modal"
                  tabIndex="-1"
                  aria-hidden="true"
                  className="relative p-4 w-full max-w-md mx-auto"
                >
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Check In/Out</h3>
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={closeModal}
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
                    <div className="p-4 md:p-5 space-y-4">
                      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={640} height={480} />
                      <button className={cx('btn-check', 'ml-auto', 'mr-auto')} onClick={handleCheckInOutToRecognize}>
                        {checkInTime ? 'Check Out' : 'Check In'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button className={cx('btn-login')} onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      )}

      <ul className="mx-4">
        <DarkModeSwitcher />
      </ul>
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
    </header>
  );
}

export default Header;
