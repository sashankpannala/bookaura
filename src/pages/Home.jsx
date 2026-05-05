import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookGrid from "../components/BookGrid";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      <Navbar />
      <Hero />
      <BookGrid />
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default Home;