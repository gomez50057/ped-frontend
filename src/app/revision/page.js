import React from 'react';
import ChoiceCard from '@/components/reviews/ChoiceCard';
import NavbarDashboardViews from '@/components/shared/NavbarDashboardViews';

const DashboardPage = () => {
  return (
    <div>
      <NavbarDashboardViews />
      <ChoiceCard />
    </div>
  );
};

export default DashboardPage;
