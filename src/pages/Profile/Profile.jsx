import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCakeCandles, faCheckCircle, faEnvelope, faMobile } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

import GlobalContext from '~/context/GlobalContext';
import axiosInstance from '~/axiosConfig/axiosConfig';
import Popup from '~/components/Popup';

const Profile = () => {
  const { userId } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const data = response.data.data;
        setUserInfo(data);
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          date_of_birth: data.date_of_birth,
          avatar: null,
        });
      } catch (error) {
        console.error('Fetch user info error:', error);
      }
    };
    fetchUserInfo();
  }, [userId]);

  const getAllName = (firstName, lastName) => `${firstName} ${lastName}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        updateData.append(key, formData[key]);
      }
    }

    try {
      await axiosInstance.put(`/users/${userId}`, updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await axiosInstance.get(`/users/${userId}`);
      setUserInfo(response.data.data);
      setIsModalOpen(false);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Update user info error:', error);
      }
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  return (
    <div
      className={`font-sans antialiased leading-normal tracking-wider bg-cover text-gray-100 w-full`}
      style={{ backgroundImage: "url('https://source.unsplash.com/1L71sPT5XKc')" }}
    >
      <div className=" w-full flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
        <div
          id="profile"
          className={`w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-gray-900 opacity-75 mx-6 lg:mx-0`}
        >
          <div className="p-4 md:p-12 text-center lg:text-left">
            <div
              className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
              style={{ backgroundImage: "url('https://source.unsplash.com/MP0IUfwrn0A')" }}
            ></div>

            <h1 className="text-3xl font-bold pt-8 lg:pt-0">
              {userInfo && getAllName(userInfo.first_name, userInfo.last_name)}
            </h1>
            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
              <FontAwesomeIcon icon={faEnvelope} className="h-4 fill-current text-green-700 pr-4" />
              Email: {userInfo && userInfo.email}
            </p>
            <p className="pt-2 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
              <FontAwesomeIcon icon={faCakeCandles} className="h-4 fill-current text-green-700 pr-4" />
              Date of birth: {userInfo && userInfo.date_of_birth}
            </p>
            <p className="pt-2 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
              <FontAwesomeIcon icon={faMobile} className="h-4 fill-current text-green-700 pr-4" />
              Phone number: {userInfo && userInfo.phone_number}
            </p>
            <p className="pt-8 text-sm">Have good day!</p>

            <div className="pt-12 pb-8">
              <button
                onClick={openModal}
                className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"
              >
                Update profile
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isModalOpen && (
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
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Update Profile</h3>
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
                    <div className="p-4">
                      <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                          <label
                            htmlFor="first_name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your first name
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData.first_name}
                            onChange={handleInputChange}
                          />
                          {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                        </div>
                        <div>
                          <label
                            htmlFor="last_name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your last name
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData.last_name}
                            onChange={handleInputChange}
                          />
                          {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                        </div>

                        <div>
                          <label
                            htmlFor="phone_number"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your phone number
                          </label>
                          <input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                          />
                          {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                        </div>
                        <div>
                          <label
                            htmlFor="date_of_birth"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your date of birth
                          </label>
                          <input
                            type="date"
                            name="date_of_birth"
                            id="date_of_birth"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                          />
                          {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
                        </div>
                        <div>
                          <label
                            htmlFor="avatar"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Your avatar
                          </label>
                          <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            onChange={handleFileChange}
                          />
                          {errors.avatar && <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>}
                        </div>
                        <button
                          type="submit"
                          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Update Profile
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
              className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center p-4"
            >
              <Popup icon={<FontAwesomeIcon icon={faCheckCircle} />} children={'Update profile successfully!'} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full lg:w-2/5">
          <img
            src={
              userInfo && userInfo.avatar_url
                ? `http://127.0.0.1:3000/${userInfo.avatar_url}`
                : 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg'
            }
            className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
            alt="Author"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
