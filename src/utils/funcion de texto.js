// Negrita: **Este texto estará en negrita**
// Cursiva: *Este texto estará en cursiva*
// Viñetas: * Elemento de lista
// Saltos de línea: \n
// Negrita y Cursiva: **_Este texto estará en negrita y Cursiva_**

// Función para procesar texto con negritas, cursivas y combinaciones
export const renderTextWithStyles = (text) => {
  const combinedRegex = /(\*\*_(.*?)_\*\*)|(\*\*(.*?)\*\*)|(\*(.*?)\*)/g;

  const elements = [];
  let lastIndex = 0;

  text.replace(combinedRegex, (match, boldItalic, boldItalicContent, bold, boldContent, italic, italicContent, offset) => {
    // Agregar el texto previo a la coincidencia
    if (offset > lastIndex) {
      elements.push(text.substring(lastIndex, offset));
    }

    // Negrita y cursiva
    if (boldItalicContent) {
      elements.push(
        <strong key={offset}>
          <em>{boldItalicContent}</em>
        </strong>
      );
    }
    // Negrita
    else if (boldContent) {
      elements.push(<strong key={offset}>{boldContent}</strong>);
    }
    // Cursiva
    else if (italicContent) {
      elements.push(<em key={offset}>{italicContent}</em>);
    }
    lastIndex = offset + match.length;
  }
  );

  // Agregar el resto del texto después de la última coincidencia
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }
  return elements;
};

// Función para renderizar texto con saltos de línea, viñetas y estilos
export const renderDescription = (description) => {
  return description.split("\n").map((line, index) => {
    if (line.startsWith("*")) {
      // Aplica una clase específica para viñetas alineadas a la derecha
      return (
        <li key={index} className={styles.rightAlignedList}>
          {renderTextWithStyles(line.substring(2))}
        </li>
      );
    } else if (line.trim() === "") {
      return <br key={index} />;
    } else {
      return (
        <p key={index} style={{ margin: "0.5rem 0" }}>
          {renderTextWithStyles(line)}
        </p>
      );
    }
  });
};