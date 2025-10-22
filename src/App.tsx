import Routes from "./Routes";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  return (
    <>
      <Routes />
      <Analytics />
    </>
  );
};

export default App;
