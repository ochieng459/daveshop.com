import React, { useState, useEffect } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext"; // Import CartContext
import './home.css';

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [accessories, setAccessories] = useState([]);
  const [refurbished, setRefurbished] = useState([]);
  const [phoneRepairs, setPhoneRepairs] = useState([]);
  const [laptopRepairs, setLaptopRepairs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const { cart, addToCart } = useCart(); // Destructure cart context

  // Helper function to determine type from item
  const getTypeFromItem = (item) => {
    if (phoneRepairs.find(i => i.id === item.id)) return 'phone_repairs';
    if (laptopRepairs.find(i => i.id === item.id)) return 'laptop_repairs';
    if (accessories.find(i => i.id === item.id)) return 'accessories';
    if (refurbished.find(i => i.id === item.id)) return 'refurbished_products';
    return 'products'; // fallback
  };

  // Helper function to navigate to product detail
  const viewProduct = (item, type) => {
    window.location.href = `/product/${type}/${item.id}`;
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      // Accessories
      let { data: accessoriesData, error: accErr } = await supabase
        .from('accessories')
        .select('*')
        .order('id', { ascending: true });
      if (!accErr) setAccessories(accessoriesData);

      // Refurbished
      let { data: refurbishedData, error: refErr } = await supabase
        .from('refurbished_products')
        .select('*')
        .order('id', { ascending: true });
      if (!refErr) setRefurbished(refurbishedData);

      // Phone Repairs
      let { data: phoneData, error: phoneErr } = await supabase
        .from('phone_repairs')
        .select('*')
        .order('id', { ascending: true });
      if (!phoneErr) setPhoneRepairs(phoneData);

      // Laptop Repairs
      let { data: laptopData, error: laptopErr } = await supabase
        .from('laptop_repairs')
        .select('*')
        .order('id', { ascending: true });
      if (!laptopErr) setLaptopRepairs(laptopData);
    };

    fetchData();
  }, []);

  // Filter search results
  useEffect(() => {
    const query = search.toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }
    const results = [
      ...phoneRepairs.filter(item => item.name.toLowerCase().includes(query)),
      ...laptopRepairs.filter(item => item.name.toLowerCase().includes(query)),
      ...accessories.filter(item => item.name.toLowerCase().includes(query)),
      ...refurbished.filter(item => item.name.toLowerCase().includes(query)),
    ];
    setSearchResults(results);
  }, [search, phoneRepairs, laptopRepairs, accessories, refurbished]);

  return (
    <div>
      {/* HEADER */}
      <header>
        <div className="container">
          <h1>Dave Tech</h1>

          <div 
  className={`hamburger ${isMenuOpen ? "open" : ""}`} 
  onClick={() => setIsMenuOpen(!isMenuOpen)}
>
  <span className="bar"></span>
  <span className="bar"></span>
  <span className="bar"></span>
</div>

          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <nav className={isMenuOpen ? "nav open" : "nav"}>
  <ul>
    <li onClick={() => { scrollToSection("phone"); setIsMenuOpen(false); }}>Phone Repair</li>
    <li onClick={() => { scrollToSection("laptop"); setIsMenuOpen(false); }}>Laptop Repair</li>
    <li onClick={() => { scrollToSection("accessories"); setIsMenuOpen(false); }}>Accessories</li>
    <li onClick={() => { scrollToSection("refurbished"); setIsMenuOpen(false); }}>Refurbished</li>
  </ul>
</nav>

      </header>
      {/* Floating Cart */}
<div className="floating-cart" onClick={() => window.location.href="/cart"}>
  <ShoppingCart size={26} />
  {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
</div>


      {/* BODY */}
      <main>
        {/* SEARCH RESULTS */}
{search && (
  <section id="search-results">
    <h2>Search Results</h2>
    {searchResults.length > 0 ? (
      <div className="cards">
        {searchResults.map((item) => (
          <div className="card" key={`${item.id}-${item.name}`}>
            {item.image_url ? (
              Array.isArray(item.image_url) ? (
                <div className="images">
                  {item.image_url.map((url, idx) => (
                    <img src={url} alt={`${item.name}-${idx}`} key={idx} />
                  ))}
                </div>
              ) : (
                <img src={item.image_url} alt={item.name} />
              )
            ) : (
              <div className="no-image">No image</div>
            )}
            <h3>{item.name}</h3>
            {item.issues && <p className="issues">{item.issues}</p>}
            {item.description && <p>{item.description}</p>}
            <p className="price">Ksh.{item.price}</p>
            <div className="card-buttons">
              {item.issues ? (
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/254741145421?text=Hello! I need help with ${item.name}`,
                      "_blank"
                    )
                  }
                >
                  Talk to Us
                </button>
              ) : (
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              )}
              <button 
                className="view-product-btn"
                onClick={() => viewProduct(item, getTypeFromItem(item))}
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No results found.</p>
    )}
  </section>
)}


        {/* PHONE REPAIR */}
        <section id="phone">
          <h2>Phone Repair</h2>
          <div className="cards">
            {phoneRepairs.slice(0,5).map((item) => (
              <div className="card" key={item.id}>
                <div className="images">
  <img src={item.image_url} alt={item.name} />
</div>

                <h3>{item.name}</h3>
                <p className="issues">{item.issues}</p>
                <p className="price">Ksh.{item.price}</p>
                <div className="card-buttons">
                  <button
                    onClick={() =>
                      window.open(`https://wa.me/254741145421?text=Hello! I need help with ${item.name}`, "_blank")
                    }
                  >
                    Talk to Us
                  </button>
                  <button 
                    className="view-product-btn"
                    onClick={() => viewProduct(item, 'phone_repairs')}
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="see-more">
            <button onClick={() => window.location.href="/phone"}>
              See More Phone Repairs
            </button>
          </div>
        </section>

        {/* LAPTOP REPAIR */}
        <section id="laptop">
          <h2>Laptop Repair</h2>
          <div className="cards">
            {laptopRepairs.slice(0,5).map((item) => (
              <div className="card" key={item.id}>
                <div className="images">
  <img src={item.image_url} alt={item.name} />
</div>

                <h3>{item.name}</h3>
                <p className="issues">{item.issues}</p>
                <p className="price">Ksh.{item.price}</p>
                <div className="card-buttons">
                  <button
                    onClick={() =>
                      window.open(`https://wa.me/254741145421?text=Hello! I need help with ${item.name}`, "_blank")
                    }
                  >
                    Talk to Us
                  </button>
                  <button 
                    className="view-product-btn"
                    onClick={() => viewProduct(item, 'laptop_repairs')}
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="see-more">
            <button onClick={() => window.location.href="/laptop"}>
              See More Laptop Repairs
            </button>
          </div>
        </section>

        {/* ACCESSORIES */}
        <section id="accessories">
          <h2>Accessories</h2>
          <div className="cards">
            {accessories.slice(0,5).map((item) => (
              <div className="card" key={item.id}>
                <img src={item.image_url} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="price">Ksh.{item.price}</p>
                <div className="card-buttons">
                  <button onClick={() => addToCart(item)}>Add to Cart</button>
                  <button 
                    className="view-product-btn"
                    onClick={() => viewProduct(item, 'accessories')}
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="see-more">
            <button onClick={() => window.location.href="/accessories"}>
              See More Accessories
            </button>
          </div>
        </section>

        {/* REFURBISHED */}
        <section id="refurbished">
          <h2>Refurbished Products</h2>
          <div className="cards">
            {refurbished.slice(0,5).map((item) => (
              <div className="card" key={item.id}>
                <img src={item.image_url} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="price">Ksh.{item.price}</p>
                <div className="card-buttons">
                  <button onClick={() => addToCart(item)}>Add to Cart</button>
                  <button 
                    className="view-product-btn"
                    onClick={() => viewProduct(item, 'refurbished_products')}
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="see-more">
            <button onClick={() => window.location.href="/refurbished"}>
              See More Refurbished Products
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          {/* Column 1: About / Contact */}
          <div>
            <h3>Contact Us</h3>
            <p>Email: support@davetech.com</p>
            <p>Phone: +254 741 145 421</p>
            <p>Address: kikuyu road, Nairobi</p>
          </div>

          {/* Column 2: Contact Form */}
          <div>
            <h3>Send us a message</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent!");
              }}
            >
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/254741145421"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          Chat on WhatsApp
        </a>
      </footer>
    </div>
  );
}