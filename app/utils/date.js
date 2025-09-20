import { format } from 'date-fns';

export function formatDate(date, pattern = 'PPp') {
  try {
    return date && !isNaN(new Date(date)) ? format(new Date(date), pattern) : 'N/A';
  } catch {
    return 'N/A';
  }
}