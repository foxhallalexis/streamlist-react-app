import "./Subscriptions.css";

function Subscriptions () {
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
        let cart = savedCart ? JSON.parse(savedCart) : [];

        /* Remove any subscription already in the cart */
        cart = cart.filter((item) => item.type !== "subscription");
        /* Add selected subscription */
        cart.push({
            ...subscription,
            quantity: 1
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    return (
        <main className="subscriptions-page">
            <h1>Choose Your Subscriptions</h1>
            <p>Select the plan that works best for you.</p>
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