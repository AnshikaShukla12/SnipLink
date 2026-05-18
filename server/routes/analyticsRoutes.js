const express = require('express');
const router = express.Router();
const { getUrlAnalytics, getOverview } = require('../controllers/analyticsController');
const auth = require('../middleware/auth'); // JWT token authentication guard

// --- Global Router Guard: Apply JWT protection to all routes below ---
router.use(auth);

// --- Base Routes ---
router.get('/overview', getOverview); // System overview statistics card data
router.get('/:urlId', getUrlAnalytics); // Detailed chart data for a single link

module.exports = router;
