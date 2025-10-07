import React from 'react';
import OtherPEDView from '@/components/dashboard/views/OtherPEDView';
import NavbarDashboard from '@/components/shared/NavbarDashboard';

const DashboardPage = () => {
  return (
    <div>
      <NavbarDashboard />
      <OtherPEDView />
    </div>
  );
};

export default DashboardPage;
