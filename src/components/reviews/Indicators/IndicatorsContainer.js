"use client";

import React, { useState } from "react";
import ChoiceIndicators from "./ChoiceIndicators";
import IndicatorsReview from "./IndicatorsReview";

export default function IndicatorsContainer() {
  const [view, setView] = useState("select"); // "select" | "review"

  return (
    <>
      {view === "select" && (
        <ChoiceIndicators onNext={() => setView("review")} />
      )}
      {view === "review" && <IndicatorsReview />}
    </>
  );
}
