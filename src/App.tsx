import Routes from "./Routes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App: React.FC = () => {
  return (
    <>
      <Routes />
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
