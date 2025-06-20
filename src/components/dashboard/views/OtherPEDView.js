"use client";

import ObservationsSection from "../otherSectionsPED/ObservationsSection";

export default function MiFormulario() {
  const handleObservationsChange = (newObsList) => {
    // Puedes guardar el estado o enviarlo a la API aquí
    console.log(newObsList)
  };

  return (
    <form>
      <ObservationsSection onChange={handleObservationsChange} />
      {/* ...botón submit, etc... */}

      
    </form>
  );
}
