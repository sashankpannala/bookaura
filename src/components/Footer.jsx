function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-gray-200 bg-white/70"
    >
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4">

        <div>
          <h3 className="font-semibold text-lg">BookAura</h3>
          <p className="text-sm text-gray-500 mt-1">
            Premium online bookstore experience.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          © 2026 BookAura. Built with React.
        </p>

      </div>
    </footer>
  );
}

export default Footer;