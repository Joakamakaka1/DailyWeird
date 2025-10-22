import React from "react";
import Routes from "./Routes";
import { Analytics } from "@vercel/analytics/next";

const App: React.FC = () => {
  return (
    <>
      <Routes />
      <Analytics />
    </>
  );
};

export default App;
