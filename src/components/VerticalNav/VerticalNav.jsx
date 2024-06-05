import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faClock, faClockRotateLeft, faHouse } from '@fortawesome/free-solid-svg-icons';

import Labels from '~/components/Labels';

const VerticalNav = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      <div className={` ${open ? 'w-72' : 'w-20 '} bg-dark-purple h-screen p-5  pt-8 relative duration-300`}>
        <FontAwesomeIcon
          className={`absolute cursor-pointer -right-2 top-11 border-dark-purple
          border-2 rounded-full text-white text-2xl  ${!open && 'rotate-180'}`}
          icon={faCircleChevronLeft}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <FontAwesomeIcon
            icon={faClock}
            className={`cursor-pointer duration-500 ${open && 'rotate-[360deg] text-blue-300'} text-white`}
          />
          <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!open && 'scale-0'}`}>
            Time Keeping
          </h1>
        </div>
        <ul className="pt-6">
          <li
            className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2 bg-light-white ${!open && 'justify-center'}`}
          >
            <FontAwesomeIcon
              icon={faHouse}
              className={`cursor-pointer duration-500 ${open && 'rotate-[360deg] text-blue-300'} text-white`}
            />
            <span className={`${!open && 'hidden'} origin-left duration-200 text-white`}>Dashboard</span>
          </li>
          <li
            className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2  ${!open && 'justify-center'}`}
          >
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              className={`cursor-pointer duration-500 ${open && 'rotate-[360deg] text-blue-300'} text-white`}
            />
            <span className={`${!open && 'hidden'} origin-left duration-200 text-white`}>History</span>
          </li>
        </ul>
        <Labels />
      </div>
    </div>
  );
};
export default VerticalNav;
