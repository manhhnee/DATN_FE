import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import axiosInstance from '../../axiosConfig/axiosConfig';
import Popup from '~/components/Popup';
import config from '~/config';

const Capture = () => {
  const params = useParams();
  const navigate = useNavigate();

  const webcamRef = useRef(null);
  const [message, setMessage] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const maxCaptures = 50;

  const capture = useCallback(async () => {
    setCapturing(true);
    let count = 0;

    while (count < maxCaptures) {
      const imageSrc = webcamRef.current.getScreenshot();
      const base64Image = imageSrc.split(',')[1];
      try {
        await axiosInstance.post(`http://localhost:3000/api/v1/generate_dataset/${params['user_id']}`, {
          image: base64Image,
          frame: count,
        });
        setCaptureCount(count + 1);
      } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to generate dataset.');
        setCapturing(false);
        return;
      }
      count++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setMessage('Dataset generated successfully.');
    setCapturing(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate(config.routes.accountManagement);
    }, 3000);
    navigate(config.routes.accountManagement);
  }, [params, navigate]);

  return (
    <div className="flex items-center justify-center">
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={640} height={480} />
      <button
        onClick={capture}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-8"
        disabled={capturing}
      >
        {capturing ? `Capturing ${captureCount}/${maxCaptures}` : 'Capture photos'}
      </button>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-0 left-0 z-50 flex justify-center items-center p-4"
          >
            <Popup icon={<FontAwesomeIcon icon={faCircleCheck} />} children={message} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Capture;
