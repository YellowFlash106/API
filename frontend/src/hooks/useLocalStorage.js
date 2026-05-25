import { useState } from "react";

export const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    return JSON.parse(localStorage.getItem(key)) || initial;
  });

  const update = (val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, update];
};