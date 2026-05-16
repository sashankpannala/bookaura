import Hero from "../components/Hero";
import BookGrid from "../components/BookGrid";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import { BooksProvider } from "../context/BooksContext";

function Home() {
  return (
    <BooksProvider>
      <div className="bg-[#f5f5f7] min-h-screen">
        <Hero />
        <BookGrid />
        <Footer />
        <CartDrawer />
      </div>
    </BooksProvider>
  );
}

export default Home;
