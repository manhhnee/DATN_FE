import Breadcrumb from '~/components/Breadcrumbs';
import AdminLayouts from '~/layouts/AdminLayouts/AdminLayouts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const productData = [
  {
    email: 'abc@gmail.com',
    name: 'ABC XYZ',
    phone_number: '0123456789',
    date_of_birth: '1990-01-01',
  },
  {
    email: 'abc@gmail.com',
    name: 'ABC XYZ',
    phone_number: '0123456789',
    date_of_birth: '1990-01-01',
  },
  {
    email: 'abc@gmail.com',
    name: 'ABC XYZ',
    phone_number: '0123456789',
    date_of_birth: '1990-01-01',
  },
  {
    email: 'abc@gmail.com',
    name: 'ABC XYZ',
    phone_number: '0123456789',
    date_of_birth: '1990-01-01',
  },
];

const AccountManagement = () => {
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [formData1, setFormData1] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    avatar: null,
  });

  const [formData2, setFormData2] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    avatar: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('update account');
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    console.log('create account');
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1({
      ...formData1,
      [name]: value,
    });
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2({
      ...formData2,
      [name]: value,
    });
  };

  const handleFileChange1 = (e) => {
    setFormData1({
      ...formData1,
      avatar: e.target.files[0],
    });
  };

  const handleFileChange2 = (e) => {
    setFormData2({
      ...formData2,
      avatar: e.target.files[0],
    });
  };

  const openModal1 = () => {
    setIsModalOpen1(true);
  };

  const openModal2 = () => {
    setIsModalOpen2(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };

  return (
    <AdminLayouts>
      <Breadcrumb pageName={'Account-Management'} />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">List Account</h4>
          <button
            type="button"
            onClick={openModal2}
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

        {productData.map((product, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-black dark:text-white">{product.email}</p>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">{product.name}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">${product.phone_number}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">{product.date_of_birth}</p>
            </div>
            <div className="flex border-[#eee]  dark:border-strokedark">
              <div className="flex space-x-3.5">
                <button className="hover:text-primary-600">
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
                <button onClick={openModal1} className="hover:text-primary-600">
                  <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                  </svg>
                </button>
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
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Update Profile</h3>
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
                      <form className="space-y-4" onSubmit={handleSubmit}>
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
                            value={formData1.first_name}
                            onChange={handleInputChange1}
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
                            value={formData1.last_name}
                            onChange={handleInputChange1}
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
                            value={formData1.phone_number}
                            onChange={handleInputChange1}
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
                            value={formData1.date_of_birth}
                            onChange={handleInputChange1}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="avatar"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter avatar
                          </label>
                          <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            onChange={handleFileChange1}
                          />
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
          {isModalOpen2 && (
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
                        onClick={closeModal2}
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
                            onChange={handleInputChange1}
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
                            onChange={handleInputChange1}
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
                            onChange={handleInputChange1}
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
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="avatar"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Enter avatar
                          </label>
                          <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            onChange={handleFileChange2}
                          />
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
      </div>
    </AdminLayouts>
  );
};

export default AccountManagement;
