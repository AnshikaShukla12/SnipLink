const express = require('express');
const router = express.Router();
const {
  createUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
} = require('../controllers/urlController');
const auth = require('../middleware/auth'); // JWT token authentication guard

// --- Global Router Guard: Apply JWT protection to all routes below ---
router.use(auth);

// --- Base Routes (GET: list user's links, POST: create a short link) ---
router.route('/')
  .get(getUrls)
  .post(createUrl);

// --- Detail Routes (GET: single URL details, PATCH: update, DELETE: delete) ---
router.route('/:id')
  .get(getUrl)
  .patch(updateUrl)
  .delete(deleteUrl);

module.exports = router;
