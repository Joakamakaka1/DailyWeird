import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };
  return (
    <header
      onClick={navigateHome}
      className="w-full max-w-[1500px] flex items-center py-6 mx-auto cursor-pointer"
    >
      <img src="/images/Logo2.webp" alt="" className="w-18 mb-4 mr-4" />
      <h1
        className="text-white text-2xl sm:text-3xl pb-2 font-bigbesty"
        style={{ borderBottom: "3px solid #aaff00" }}
      >
        Daily Weird
      </h1>
    </header>
  );
};

export default Header;
