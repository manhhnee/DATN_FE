import React from 'react';
import Charts from '../../components/Charts';
import Map from '../../components/Map';
import AdminLayouts from '~/layouts/AdminLayouts';

const Dashboard = () => {
  return (
    <AdminLayouts>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <Charts />
        <Map />
      </div>
    </AdminLayouts>
  );
};

export default Dashboard;
