import { ArrowRight, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-gray-600 mb-6">
            <Sparkles size={16} />
            Curated collection of 36 premium books
          </div>

          <h1 className="text-6xl lg:text-7xl font-semibold tracking-[-0.05em] leading-[0.95]">
            Books that upgrade
            <br />
            your thinking.
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl leading-8">
            Discover handpicked books in AI, business, productivity, finance,
            history, and fiction — delivered through a clean premium shopping
            experience.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#books"
              className="bg-black text-white px-7 py-4 rounded-full text-sm font-semibold hover:scale-105 transition inline-flex items-center justify-center gap-2"
            >
              Explore Books
              <ArrowRight size={17} />
            </a>

            <a
              href="#books"
              className="bg-white text-black px-7 py-4 rounded-full text-sm font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center"
            >
              Browse Categories
            </a>
          </div>
        </div>

        <div className="relative bg-black rounded-[40px] p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-56 w-56 bg-white/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 h-56 w-56 bg-white/10 blur-3xl rounded-full" />

          <div className="relative">
            <p className="text-gray-300 text-sm mb-4">Featured reads</p>

            <div className="grid grid-cols-3 gap-4">
              <img
                src="https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg"
                alt="Atomic Habits"
                className="rounded-2xl shadow-xl rotate-[-6deg]"
              />
              <img
                src="https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg"
                alt="Deep Work"
                className="rounded-2xl shadow-xl translate-y-8"
              />
              <img
                src="https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg"
                alt="Hands-On Machine Learning"
                className="rounded-2xl shadow-xl rotate-[6deg]"
              />
            </div>

            <h2 className="text-white text-3xl font-semibold mt-14">
              Build your personal library.
            </h2>

            <p className="text-gray-300 mt-3">
              Add your favorite books to cart and checkout smoothly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;