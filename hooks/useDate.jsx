import { useCallback } from 'react';

export function useDate() {
    
  const formatDateToLocalYYYYMMDD = useCallback((date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const isToday = useCallback((date) => {
    const today = new Date();
    return formatDateToLocalYYYYMMDD(today) === formatDateToLocalYYYYMMDD(date);
  }, [formatDateToLocalYYYYMMDD]);

  const isYesterday = useCallback((date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return formatDateToLocalYYYYMMDD(yesterday) === formatDateToLocalYYYYMMDD(date);
  }, [formatDateToLocalYYYYMMDD]);

  const getDayLabel = useCallback((date) => {
    if (isToday(date)) return "Aujourd'hui";
    if (isYesterday(date)) return "Hier";

    const d = new Date(date);

    const jours = [
      'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
      'Jeudi', 'Vendredi', 'Samedi'
    ];

    const mois = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`;
  }, [isToday, isYesterday]);

  return {
    formatDateToLocalYYYYMMDD,
    getDayLabel,
  };
}