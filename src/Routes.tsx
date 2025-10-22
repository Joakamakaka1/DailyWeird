import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home";
import NotFound from "./pages/404/404";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
