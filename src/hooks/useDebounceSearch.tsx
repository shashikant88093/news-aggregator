import { useEffect, useState } from 'react';
interface HandleDebounceSearchProps {

    value: string;
  
    delay: number;
  
  }
  
  
  
  const useDebounceSearch = ({ value, delay }: HandleDebounceSearchProps): string => {
  
    const [debouncedValue, setDebouncedValue] = useState(value);
  
  
  
    useEffect(() => {
  
      const handler = setTimeout(() => {
  
        setDebouncedValue(value);
  
      }, delay);
  
  
  
      return () => {
  
        clearTimeout(handler);
  
      };
  
    }, [value, delay]);
  
  
  
    return debouncedValue;
  
  };

    export default useDebounceSearch;