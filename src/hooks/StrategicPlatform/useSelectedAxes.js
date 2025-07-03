import { useEffect, useState, useMemo } from 'react';
import { fetchWithAuth } from '@/utils/auth';
import { AXES } from '@/utils/axes';

// Puedes crear AXES_MAP aquí o exportarlo también desde utils/axes.js
const AXES_MAP = Object.fromEntries(AXES.map(a => [a.id, a.code]));


export function useSelectedAxes() {
  const [selectedAxesIds, setSelectedAxesIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function loadEjes() {
      setLoading(true);
      try {
        const response = await fetchWithAuth('/api/plataforma/user-axis-selection/');
        if (response.ok) {
          const data = await response.json();
          let ids = [];
          if (Array.isArray(data)) {
            ids = data[0]?.axes || [];
          } else if (typeof data === 'object' && data !== null) {
            ids = data.axes || [];
          }
          if (!ignore) setSelectedAxesIds(Array.isArray(ids) ? ids : []);
        } else if (!ignore) {
          setSelectedAxesIds([]);
        }
      } catch (err) {
        if (!ignore) setSelectedAxesIds([]);
      }
      if (!ignore) setLoading(false);
    }
    loadEjes();
    return () => { ignore = true };
  }, []);

  const selectedCodes = useMemo(
    () => selectedAxesIds.map(id => AXES_MAP[id]).filter(Boolean),
    [selectedAxesIds]
  );

  return { selectedAxesIds, selectedCodes, loading };
}
