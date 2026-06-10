'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

/* Registro de styled-jsx para el App Router: junta los estilos de cada
   página durante el render del servidor y los inserta en el <head> del
   HTML inicial. Sin esto, el CSS recién aparece al hidratar (FOUC). */
export default function StyledJsxRegistry({ children }) {
  const [registry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = registry.styles();
    registry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>;
}
