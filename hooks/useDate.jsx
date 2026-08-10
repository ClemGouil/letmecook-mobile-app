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

  const getDayPeriodFromToday = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `${diffDays} jours`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} semaine(s)`;
    }
    return date.toLocaleDateString();
  };

  return {
    formatDateToLocalYYYYMMDD,
    getDayLabel,
    getDayPeriodFromToday
  };
}