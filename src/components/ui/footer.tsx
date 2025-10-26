const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-[1500px] mx-auto pt-20 pb-10 flex flex-col items-center gap-4">
      <p className="text-sm text-[#c5ff75] font-roboto">
        © {new Date().getFullYear()} DailyWeird.top — All the weird, every day.
      </p>
    </footer>
  );
};

export default Footer;
