import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home";
import NotFound from "./pages/404/404";
import EmailModalUnsubscribe from "./pages/Unsubscribe/unsubscribe";
import AuthCallback from "./auth/callback";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/unsubscribe" element={<EmailModalUnsubscribe />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
