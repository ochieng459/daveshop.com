import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // <-- import CartContext
import './home.css'; // reuse existing card styles

export default function ProductsPage() {
  const { category } = useParams(); // e.g., 'accessories', 'refurbished', 'phone', 'laptop'
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const { addToCart } = useCart(); // <-- useCart hook

  // Helper to get type for product URL
  const getTypeFromCategory = (cat) => {
    switch (cat) {
      case "phone":
        return "phone_repairs";
      case "laptop":
        return "laptop_repairs";
      case "accessories":
        return "accessories";
      case "refurbished":
        return "refurbished_products";
      default:
        return cat;
    }
  };

  // Fetch products for the category
  useEffect(() => {
    const fetchProducts = async () => {
      const tableName = getTypeFromCategory(category);

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("id", { ascending: true });

      if (error) console.log("Error fetching products:", error);
      else setProducts(data);
    };

    fetchProducts();
  }, [category]);

  // Navigate to product detail
  const viewProduct = (item) => {
    const type = getTypeFromCategory(category);
    navigate(`/product/${type}/${item.id}`);
  };

  return (
    <div className="products-page container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      <div className="cards">
        {products.map((item) => (
          <div className="card" key={item.id}>
            {item.image_urls ? (
              <div className="images">
                {item.image_urls.map((url, idx) => (
                  <img src={url} alt={`${item.name}-${idx}`} key={idx} />
                ))}
              </div>
            ) : (
              <img src={item.image_url} alt={item.name} />
            )}
            <h3>{item.name}</h3>
            {item.issues && <p className="issues">{item.issues}</p>}
            {item.description && <p>{item.description}</p>}
            {item.price && <p className="price">Ksh.{item.price}</p>}

            <div className="card-buttons">
              {["phone", "laptop"].includes(category) ? (
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
                <button onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              )}

              {/* View Product Button */}
              <button
                className="view-product-btn"
                onClick={() => viewProduct(item)}
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
