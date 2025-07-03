import React from 'react';
import ChoiceCard from '@/components/dashboard/ChoiceCard';
import NavbarDashboard from '@/components/shared/NavbarDashboard';

const DashboardPage = () => {
  return (
    <div>
      <NavbarDashboard />
      <ChoiceCard />
    </div>
  );
};

export default DashboardPage;
