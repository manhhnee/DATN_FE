import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNoteSticky, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';

import Breadcrumb from '~/components/Breadcrumbs';
import AdminLayouts from '~/layouts/AdminLayouts/AdminLayouts';
import axiosInstance from '~/axiosConfig';
import Popup from '~/components/Popup';

const Holiday = () => {
  const [holidays, setHolidays] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [holidayId, setHolidayId] = useState();
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    holiday_date: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axiosInstance.get('/holidays');
        setHolidays(response.data);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          console.log(error.response.data);
        } else {
          console.error('Fetch holiday error:', error);
        }
      }
    };
    fetchHolidays();
  }, []);

  const handleCreateHolidays = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(
        '/holidays',
        {
          holiday: {
            holiday_date: formData.holiday_date,
            description: formData.description,
          },
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const holidays = await axiosInstance.get('/holidays');
      setHolidays(holidays.data);
      setFormData({ holiday_date: '', description: '' });
      setMessage('Create holiday successfully !');
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      if (error.response.status) {
        setMessage('Holiday has already been taken!');
        setFormData({ holiday_date: '', description: '' });
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/holidays/${holidayId}`);
      const holidays = await axiosInstance.get('/holidays');
      setHolidays(holidays.data);
      setIsOpenModal(false);
      setMessage('Delete holiday successfully !');
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      if (error.response.status) {
        setMessage('Can not delete this holiday !');
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
  };

  const openModal = (holiday_id) => {
    setHolidayId(holiday_id);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    <AdminLayouts>
      <div className="mx-auto ">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Holiday Information</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleCreateHolidays}>
                  <div className="mb-5.5">
                    <label
                      htmlFor="holiday_date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Enter date of holiday
                    </label>
                    <input
                      type="date"
                      name="holiday_date"
                      id="holiday_date"
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      value={formData.holiday_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="Username">
                      Description
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FontAwesomeIcon icon={faNoteSticky} />
                      </span>

                      <textarea
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="description"
                        id="description"
                        rows={6}
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      onClick={() => setFormData({ holiday_date: '', description: '' })}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-center py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white ">List Holiday</h4>
              </div>

              <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-2 flex items-center">
                  <p className="font-medium">Date</p>
                </div>
                <div className="col-span-4 hidden items-center sm:flex">
                  <p className="font-medium">Description</p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="font-medium">Action</p>
                </div>
              </div>
              {holidays.map((holiday, key) => {
                return (
                  <div
                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                  >
                    <div className="col-span-2 flex items-center">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <p className="text-sm text-black dark:text-white">{holiday.holiday_date}</p>
                      </div>
                    </div>
                    <div className="col-span-4 flex items-center">
                      <p className="text-sm text-black dark:text-white">{holiday.description}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <button onClick={() => openModal(holiday.id)} className="hover:text-primary-600">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    {isOpenModal && (
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
                                  className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded px-4 py-2 text-center"
                                  onClick={closeModal}
                                >
                                  <FontAwesomeIcon icon={faXmark} className="pr-3" />
                                  Cancel
                                </button>
                                <button
                                  onClick={handleConfirmDelete}
                                  className="bg-red-600 text-white rounded px-4 py-2 text-center"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="pr-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}
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
    </AdminLayouts>
  );
};

export default Holiday;
