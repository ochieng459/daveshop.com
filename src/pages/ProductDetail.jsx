import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext"; // Add this import
import './home.css'; // Keep the main styles

export default function ProductDetail() {
  const { type, id } = useParams(); // type = table name, id = product id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from(type)
        .select('*')
        .eq('id', id)
        .single(); // fetch a single item
      if (error) {
        console.error(error);
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [type, id]);

  if (loading) return (
    <div className="product-detail-page">
      <div className="loading-state">Loading product details...</div>
    </div>
  );
  
  if (!product) return (
    <div className="product-detail-page">
      <p>Product not found.</p>
      <Link to="/" className="back-button">← Back to Home</Link>
    </div>
  );

  // Determine if it's a repair service or product
  const isRepairService = type === 'phone_repairs' || type === 'laptop_repairs';
  const displayType = type === 'phone_repairs' ? 'Phone Repair' : 
                     type === 'laptop_repairs' ? 'Laptop Repair' :
                     type === 'accessories' ? 'Accessory' :
                     'Refurbished Product';

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={`/${type === 'phone_repairs' ? 'phone' : 
                          type === 'laptop_repairs' ? 'laptop' : 
                          type === 'accessories' ? 'accessories' : 
                          'refurbished'}`}>{displayType}s</Link>
        <span>›</span>
        <span>{product.name}</span>
      </div>

      <h1>{product.name}</h1>

      {/* Back Button */}
      <Link to={`/${type === 'phone_repairs' ? 'phone' : 
                        type === 'laptop_repairs' ? 'laptop' : 
                        type === 'accessories' ? 'accessories' : 
                        'refurbished'}`} className="back-button">
        ← Back to {displayType}s
      </Link>

      {/* Images */}
      {product.image_url ? (
        Array.isArray(product.image_url) ? (
          <div className="images">
            {product.image_url.map((url, idx) => (
              <img src={url} alt={`${product.name}-${idx}`} key={idx} />
            ))}
          </div>
        ) : (
          <img src={product.image_url} alt={product.name} />
        )
      ) : (
        <div className="no-image">No image available</div>
      )}

      {/* Description */}
      {product.description && (
        <div className="product-description">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>
      )}

      {/* Issues for repair services */}
      {product.issues && (
        <div className="product-issues">
          <h2>Common Issues</h2>
          <p className="issues">{product.issues}</p>
        </div>
      )}

      {/* Price */}
      <div className="product-price">
        <h2>Price</h2>
        <p className="price">Ksh.{product.price}</p>
      </div>

      {/* Product Specifications */}
      {(product.category || product.brand || product.model) && (
        <div className="specifications">
          <h2>Specifications</h2>
          <div className="spec-grid">
            {product.category && (
              <div className="spec-item">
                <span className="spec-label">Category:</span>
                <span className="spec-value">{product.category}</span>
              </div>
            )}
            {product.brand && (
              <div className="spec-item">
                <span className="spec-label">Brand:</span>
                <span className="spec-value">{product.brand}</span>
              </div>
            )}
            {product.model && (
              <div className="spec-item">
                <span className="spec-label">Model:</span>
                <span className="spec-value">{product.model}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="product-actions">
        {isRepairService ? (
          <button 
            className="whatsapp-btn"
            onClick={() => window.open(`https://wa.me/254741145421?text=Hello! I need help with ${product.name}`, "_blank")}
          >
            Chat on WhatsApp for Repair
          </button>
        ) : (
          <button onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        )}
        
        <button 
          className="view-product-btn"
          onClick={() => window.open(`https://wa.me/254741145421?text=Hello! I have a question about ${product.name}`, "_blank")}
        >
          Ask Questions on WhatsApp
        </button>
      </div>
    </div>
  );
}