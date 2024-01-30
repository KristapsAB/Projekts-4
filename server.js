const express = require('express');
const stripe = require('stripe')('your_stripe_secret_key');

const app = express();
const port = 5000;
app.use(cors());

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items,
      customer: req.body.userId,
      mode: 'payment',
      success_url: 'http://your-website.com/success',
      cancel_url: 'http://your-website.com/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
