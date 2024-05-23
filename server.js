require('dotenv').config()

// set up express server
const express = require('express');
const app = express();

// middleware
const cors = require('cors');
app.use(cors({
    origin: CLIENT_URL,
}));

// set up bodyParser to read JSON data
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// import stripe and use it with our key
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

// api request 
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
        });
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
