import React, { useContext } from 'react';
import Header from '~/layouts/components/Header';
import Sidebar from '~/layouts/components/Sidebar';
import GlobalContext from '~/context/GlobalContext';
import EventModal from '~/components/EventModel';

function DefaultLayout({ children }) {
  const { showEventModal } = useContext(GlobalContext);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}

      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}

export default DefaultLayout;
