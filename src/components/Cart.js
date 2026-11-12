import { useState } from "react";
import "./Cart.css";

function Cart() {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const updateCart = (updatedCart) => {
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const increaseQuantity = (id) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id && item.type !== "subscription"
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );

        updateCart(updatedCart);
    };

    const decreaseQuantity = (id) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id && 
item.type !== "subscription" && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );

        updateCart(updatedCart);
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        updateCart(updatedCart);
    };

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartTotal = cartItems.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
    );

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is currently empty.</p>
            ) : (
                <div className="cart-items">

                    {cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>

                            <div className="cart-item-icon">
                                <span className="material-symbols-rounded">
                                    {item.icon}
                                </span>
                            </div>

                            <div className="cart-item-details">
                                <h2>{item.name}</h2>

                                <p>
                                    Price: ${Number(item.price).toFixed(2)}
                                </p>

                                {item.type !== "subscription" && (
                                    <div className="quantity-controls">

                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item.id)
                                            }
                                        >
                                            -
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                increaseQuantity(item.id)
                                            }
                                        >
                                            +
                                        </button>

                                    </div>
                                )}

                                {item.type === "subscription" && (
                                    <p>Subscription Plan</p>
                                )}

                                <p>
                                    Item Total: $
                                    {(
                                        Number(item.price) *
                                        item.quantity
                                    ).toFixed(2)}
                                </p>

                                <button
                                    className="remove-button"
                                    onClick={() =>
                                        removeItem(item.id)
                                    }
                                >
                                    Remove
                                </button>

                            </div>
                        </div>
                    ))}

                    <div className="cart-summary">
                        <p>Total Items: {totalItems}</p>
                        <h2>
                            Cart Total: ${cartTotal.toFixed(2)}
                        </h2>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Cart;