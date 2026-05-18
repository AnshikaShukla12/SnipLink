const Url = require('../models/Url');
const Click = require('../models/Click');
const User = require('../models/User');
const { nanoid } = require('nanoid');
const UAParser = require('ua-parser-js');
const asyncHandler = require('../middleware/asyncHandler');

// Helper to resolve the short URL domain (prioritizes BASE_URL env for production/network sharing)
const getShortUrlDomain = (req) => {
  return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
};

// Helper to generate a unique short ID (recursive check to prevent collisions)
const generateUniqueId = async () => {
  const shortId = nanoid(8); // Generates an 8-character URL-safe string
  const collisionCheck = await Url.findOne({ shortId });
  if (collisionCheck) {
    return generateUniqueId(); // Try again if collided (extremely rare)
  }
  return shortId;
};

// @desc    Create a shortened URL
// @route   POST /api/urls
// @access  Private (Authenticated users only)
exports.createUrl = asyncHandler(async (req, res, next) => {
  const { originalUrl, customAlias, title, expiresAt } = req.body;

  let shortId;

  // 1. If custom alias is provided, validate its uniqueness
  if (customAlias) {
    // Custom alias cannot match any existing shortId or customAlias
    const existing = await Url.findOne({
      $or: [{ shortId: customAlias }, { customAlias }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This custom alias is already taken. Please choose another.',
      });
    }
    shortId = customAlias;
  } else {
    // 2. Generate a random unique short ID
    shortId = await generateUniqueId();
  }

  // 3. Save link to database under authenticated user's ID
  const url = await Url.create({
    originalUrl,
    shortId,
    customAlias: customAlias || undefined,
    user: req.user.id,
    title: title || undefined,
    expiresAt: expiresAt || undefined,
  });

  // 4. Denormalization update: Increment user's total link count
  await User.findByIdAndUpdate(req.user.id, { $inc: { urlCount: 1 } });

  // 5. Respond with full details including computed shortened link URL
  const domain = getShortUrlDomain(req);
  res.status(201).json({
    success: true,
    url: {
      id: url._id,
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      shortUrl: `${domain}/${url.shortId}`,
      customAlias: url.customAlias,
      title: url.title,
      totalClicks: url.totalClicks,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    },
  });
});

// @desc    Get user's links (Paginated, Searchable)
// @route   GET /api/urls
// @access  Private
exports.getUrls = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  // Standard query filters by logged in user
  const query = { user: req.user.id };

  // If search keyword is active, filter by matching title, originalUrl, or shortId
  if (search) {
    query.$or = [
      { originalUrl: { $regex: search, $options: 'i' } },
      { shortId: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
    ];
  }

  // Perform parallel counts and paginated listings for high speed
  const [urls, total] = await Promise.all([
    Url.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Url.countDocuments(query),
  ]);

  const domain = getShortUrlDomain(req);

  res.status(200).json({
    success: true,
    urls: urls.map((url) => ({
      id: url._id,
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      shortUrl: `${domain}/${url.shortId}`,
      customAlias: url.customAlias,
      title: url.title,
      totalClicks: url.totalClicks,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get details of a single URL
// @route   GET /api/urls/:id
// @access  Private
exports.getUrl = asyncHandler(async (req, res, next) => {
  // Ensure the link belongs to the logged-in user!
  const url = await Url.findOne({ _id: req.params.id, user: req.user.id });

  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'Short link not found or you are not authorized to view it',
    });
  }

  const domain = getShortUrlDomain(req);

  res.status(200).json({
    success: true,
    url: {
      id: url._id,
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      shortUrl: `${domain}/${url.shortId}`,
      customAlias: url.customAlias,
      title: url.title,
      totalClicks: url.totalClicks,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    },
  });
});

// @desc    Update URL properties (Soft-toggle active status, rename title)
// @route   PATCH /api/urls/:id
// @access  Private
exports.updateUrl = asyncHandler(async (req, res, next) => {
  const { title, isActive } = req.body;

  const url = await Url.findOne({ _id: req.params.id, user: req.user.id });

  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'Short link not found or you are not authorized to edit it',
    });
  }

  if (title !== undefined) url.title = title;
  if (isActive !== undefined) url.isActive = isActive;

  await url.save();

  const domain = getShortUrlDomain(req);

  res.status(200).json({
    success: true,
    url: {
      id: url._id,
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      shortUrl: `${domain}/${url.shortId}`,
      customAlias: url.customAlias,
      title: url.title,
      totalClicks: url.totalClicks,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    },
  });
});

// @desc    Delete URL and its click logs
// @route   DELETE /api/urls/:id
// @access  Private
exports.deleteUrl = asyncHandler(async (req, res, next) => {
  const url = await Url.findOne({ _id: req.params.id, user: req.user.id });

  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'Short link not found or you are not authorized to delete it',
    });
  }

  // Cascade delete: Remove all associated Click events for this URL
  await Click.deleteMany({ url: url._id });

  // Delete the actual link record
  await url.deleteOne();

  // Decrement user's total link count
  await User.findByIdAndUpdate(req.user.id, { $inc: { urlCount: -1 } });

  res.status(200).json({
    success: true,
    message: 'Shortened URL and all analytics logs have been successfully deleted',
  });
});

// @desc    Public Redirect Engine (Resolves short link to target destination)
// @route   GET /:shortId
// @access  Public
exports.redirectUrl = asyncHandler(async (req, res, next) => {
  // Query shortId index (rapid O(1) lookup)
  const url = await Url.findOne({ shortId: req.params.shortId });

  // 1. If ID doesn't exist in the database, return standard 404
  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'Short link not found. It may have been deleted by the owner.',
    });
  }

  // 2. Validate if link is enabled (soft-disabled by owner)
  if (!url.isActive) {
    return res.status(410).json({
      success: false,
      message: 'This shortened link has been deactivated by its owner.',
    });
  }

  // 3. Validate Expiration (hard expired)
  if (url.expiresAt && new Date() > url.expiresAt) {
    return res.status(410).json({
      success: false,
      message: 'This link has expired and is no longer active.',
    });
  }

  // 4. Parse User-Agent using UAParser
  const parser = new UAParser(req.headers['user-agent']);
  const uaResult = parser.getResult();

  // 5. Classify device types for Recharts Pie Chart
  let device = 'unknown';
  const rawType = uaResult.device.type; // mobile, tablet, or undefined (for desktop)
  if (rawType === 'mobile') device = 'mobile';
  else if (rawType === 'tablet') device = 'tablet';
  else if (!rawType) device = 'desktop';

  // 6. Record click event asynchronously (Fire-and-Forget pattern)
  // This does NOT delay the response redirection.
  Click.create({
    url: url._id,
    ip: req.ip || req.connection.remoteAddress || null,
    userAgent: req.headers['user-agent'] || null,
    device,
    browser: uaResult.browser.name || 'unknown',
    os: uaResult.os.name || 'unknown',
    referrer: req.headers.referer || req.headers.referrer || 'direct',
    country: 'unknown', // Placeholder: Future upgrade to geoIP lookup
    city: 'unknown',
  }).catch((err) => console.error('⚠️ Click tracking collection failed:', err));

  // 7. Increment cached click counter in background
  Url.findByIdAndUpdate(url._id, { $inc: { totalClicks: 1 } }).catch(
    (err) => console.error('⚠️ Click increment cache update failed:', err)
  );

  // 8. Execute HTTP 302 Temporary Redirect to target destination
  res.redirect(302, url.originalUrl);
});
