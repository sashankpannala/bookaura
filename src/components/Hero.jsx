import { ArrowRight, Sparkles } from "lucide-react";
import { useBooks } from "../context/BooksContext";

function Hero() {
  const { books, loading } = useBooks();
  const featured = books.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-gray-600 mb-6">
            <Sparkles size={16} />
            {loading
              ? "Loading catalog..."
              : `Curated collection of ${books.length} premium books`}
          </div>

          <h1 className="text-6xl lg:text-7xl font-semibold tracking-[-0.05em] leading-[0.95]">
            Books that upgrade
            <br />
            your thinking.
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl leading-8">
            Discover handpicked books in AI, business, productivity, finance,
            history, and fiction — loaded live from our database.
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
              {featured.length > 0 ? (
                featured.map((book, index) => (
                  <img
                    key={book.id}
                    src={book.image}
                    alt={book.title}
                    className={`rounded-2xl shadow-xl object-cover h-40 w-full ${
                      index === 0
                        ? "rotate-[-6deg]"
                        : index === 1
                          ? "translate-y-8"
                          : "rotate-[6deg]"
                    }`}
                  />
                ))
              ) : (
                <p className="col-span-3 text-gray-400 text-sm">Loading covers...</p>
              )}
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
