import { useState } from "react";
import "./Subscriptions.css";

function Subscriptions () {
    const [warning, setWarning] = useState("");
    const subscriptionPlans = [
        {
            id: "subscription-basic",
            name: "Basic Plan",
            price: 4.99,
            icon: "movie",
            type: "subscription"
        },
        {
            id: "subscription-plus",
            name: "Plus Plan",
            price: 9.99,
            icon: "theaters",
            type: "subscription"
        },
        {
            id: "subscription-premium",
            name: "Premium Plan",
            price: 14.99,
            icon: "workspace_premium",
            type: "subscription"
        }
    ];

    const addSubscriptionToCart = (subscription) => {
        const savedCart = localStorage.getItem("cart");
        const cart = savedCart ? JSON.parse(savedCart) : [];

        const existingSubscription = cart.find(
            (item) => item.type === "subscription"
        );
        if (existingSubscription) {
            setWarning(`You already have a subscription (${existingSubscription.name}) in your cart. Only one subscription can be added at a time.`);
            return;
        }

        const updatedCart = [
            ...cart,
            {
                ...subscription,
                quantity: 1
            }
        ];

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setWarning(""); // Clear any previous warning

    };

    return (
        <main className="subscriptions-page">
            <h1>Choose Your Subscriptions</h1>
            <p>Select the plan that works best for you.</p>
            {warning && (
                <p className="subscription-warning">{warning}</p>
            )}
            
            <div className="subscription-plans">
                {subscriptionPlans.map((plan) => (
                    <div className="subscription-card" key={plan.id}>
                        <span className="material-symbols-rounded">
                            {plan.icon}
                        </span>
                        <h2>{plan.name}</h2>
                        <p className="subscription-price">
                            ${plan.price.toFixed(2)}
                        </p>
                        <button
                            onClick={() => addSubscriptionToCart(plan)}>
                                Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Subscriptions;