import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  // Helper to format numbers with commas
  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  // Generate WhatsApp message for checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const message = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name} - Ksh.${formatPrice(item.price)}`
      )
      .join("%0A"); // %0A = newline in WhatsApp URL

    const url = `https://wa.me/254741145421?text=Hello! I want to buy:%0A${message}%0ATotal: Ksh.${formatPrice(totalPrice)}`;
    window.open(url, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 20px" }}>
      <h2>Your Cart</h2>
      <div style={{ display: "grid", gap: "20px" }}>
        {cart.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              gap: "15px",
            }}
          >
            <img
              src={item.image_url || (item.image_urls ? item.image_urls[0] : "")}
              alt={item.name}
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
            />
            <div style={{ flex: 1 }}>
              <h3>{item.name}</h3>
              <p>Ksh.{formatPrice(item.price)}</p>
            </div>
            <button
              onClick={() => removeFromCart(idx)}
              style={{
                padding: "6px 10px",
                backgroundColor: "#FF4D4F",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <h3>Total: Ksh.{formatPrice(totalPrice)}</h3>
        <button
          onClick={handleCheckout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Checkout via WhatsApp
        </button>
        <button
          onClick={clearCart}
          style={{
            padding: "10px 20px",
            backgroundColor: "#888",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            marginLeft: "10px",
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
