import { useState } from "react";

const useDrawer = (callback) => {
  const [state, setState] = useState(true);
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(open);
  };
  return [{ state }, toggleDrawer];
};

export default useDrawer;