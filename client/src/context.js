import { createContext } from "react";

const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: {
    latitude: 13.349,
    longitude: 74.7856,
  },
});

export default Context;
