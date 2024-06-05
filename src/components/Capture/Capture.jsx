import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import Popup from '~/components/Popup';

const Capture = () => {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const maxCaptures = 100;

  const capture = useCallback(async () => {
    setCapturing(true);
    let count = 0;

    while (count < maxCaptures) {
      const imageSrc = webcamRef.current.getScreenshot();
      try {
        const response = await axios.post('http://localhost:3000/api/v1/generate_dataset/15', {
          image: imageSrc,
          frame: count,
        });
        setCaptureCount(count + 1);
        console.log(count);
      } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to generate dataset.');
        setCapturing(false);
        return;
      }
      count++;
      await new Promise((resolve) => setTimeout(resolve, 200)); // Delay to capture next frame
    }
    setMessage('Dataset generated successfully.');
    setCapturing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [webcamRef]);

  return (
    <>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={640} height={480} />
      <button onClick={capture} disabled={capturing}>
        {capturing ? `Capturing ${captureCount}/${maxCaptures}` : 'Capture photos'}
      </button>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center p-4"
          >
            <Popup icon={<FontAwesomeIcon icon={faCircleCheck} />} children={message} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Capture;
