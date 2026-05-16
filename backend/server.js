require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    // Allow all localhost ports for dev, and deployed frontend for prod
    const allowed = [
      /^http:\/\/localhost:\d+$/,
      'https://swippo-frontend.onrender.com', // replace with your deployed frontend URL if needed
    ];
    if (!origin || allowed.some(a => (typeof a === 'string' ? a === origin : a.test(origin)))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));

app.get('/', (_, res) => res.json({ ok: true, msg: 'Swippo API v4' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('❌ DB Error:', err.message); process.exit(1); });
