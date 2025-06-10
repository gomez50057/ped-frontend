"use client";

import React from "react";
import StrategicPlatform from "@/components/dashboard/StrategicPlatform/StrategicPlatform";
import Review from "@/components/dashboard/StrategicPlatform/PlataformaEstrategicaReview";


export default function DashboardPlataforma() {
  return (
    <main>
      <StrategicPlatform />
      <Review />
    </main>
  );
}
