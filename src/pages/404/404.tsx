const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#131516] text-white">
      <h1
        className="text-6xl font-['BigBesty'] mb-4"
        style={{ borderBottom: "3px solid #aaff00" }}
      >
        404 - Page Not Found
      </h1>
      <p className="text-lg font-['Roboto']">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
