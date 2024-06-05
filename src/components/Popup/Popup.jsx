import classNames from 'classnames/bind';

import styles from './Popup.module.scss';

const cx = classNames.bind(styles);

const Popup = ({ icon, children }) => {
  return (
    <div
      className={cx(
        'absolute',
        'top-0',
        'mt-8',
        'mr-8',
        'bg-blue-600',
        'text-white',
        'p-4',
        'rounded-md',
        'shadow-md',
        'flex',
      )}
    >
      <div>{icon}</div>
      <div className="ml-2">{children}</div>
    </div>
  );
};

export default Popup;
