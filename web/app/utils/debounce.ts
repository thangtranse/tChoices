export let timeoutId: NodeJS.Timeout | null;

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
