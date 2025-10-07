"use client";

import React, { createContext, useContext, useState } from "react";

const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedEjes, setSelectedEjes] = useState([]);

  return (
    <PlatformContext.Provider
      value={{
        checkedItems,
        setCheckedItems,
        selectedEjes,
        setSelectedEjes
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);
