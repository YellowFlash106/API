import { useState } from "react";
import { readJsonStorage, writeJsonStorage } from "../utils/storage";

export const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    return readJsonStorage(key, initial);
  });

  const update = (val) => {
    setValue(val);
    writeJsonStorage(key, val);
  };

  return [value, update];
};