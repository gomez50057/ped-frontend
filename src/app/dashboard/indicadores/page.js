"use client";

import React from "react";
// import StrategicPlatform from "@/components/dashboard/Indicators/ChoiceIndicators";
import StrategicPlatform from "@/components/dashboard/Indicators/IndicatorsReview";
import NavbarDashboard from '@/components/shared/NavbarDashboard';

export default function DashboardPlataforma() {
  return (
    <main>
      <NavbarDashboard />
      <StrategicPlatform />
    </main>
  );
}
