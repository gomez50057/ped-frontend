"use client";

import React, { useState } from "react";
import StrategicPlatform from "./StrategicPlatform";
import PlataformaEstrategicaReview from "./PlataformaEstrategicaReview";

export default function PlataformaEstrategicaContainer() {
  const [view, setView] = useState("select"); // "select" | "review"

  return (
    <>
      {view === "select" && (
        <StrategicPlatform onNext={() => setView("review")} />
      )}
      {view === "review" && <PlataformaEstrategicaReview />}
    </>
  );
}
