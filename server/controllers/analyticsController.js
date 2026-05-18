const Click = require('../models/Click');
const Url = require('../models/Url');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get complete analytics breakdown for a single URL
// @route   GET /api/analytics/:urlId
// @access  Private (Authenticated users only)
exports.getUrlAnalytics = asyncHandler(async (req, res, next) => {
  const { urlId } = req.params;
  const days = parseInt(req.query.days, 10) || 30; // Defaults to 30 days analysis window

  // 1. Verify URL ownership to prevent cross-user analytics snooping
  const url = await Url.findOne({ _id: urlId, user: req.user.id });
  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'Short link not found or you are not authorized to view its statistics',
    });
  }

  // 2. Set the starting boundary date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // 3. Query matching clicks in the time boundary
  const clicks = await Click.find({
    url: url._id,
    timestamp: { $gte: startDate },
  }).sort({ timestamp: -1 });

  // 4. Mongoose Aggregation Pipeline: Clicks Trend grouped by Date
  const clicksByDate = await Click.aggregate([
    {
      $match: {
        url: url._id,
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Chronological sort
  ]);

  // 5. Aggregation Pipeline: Device Category distribution (Pie Chart)
  const clicksByDevice = await Click.aggregate([
    { $match: { url: url._id, timestamp: { $gte: startDate } } },
    { $group: { _id: '$device', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // 6. Aggregation Pipeline: Browser Type distribution (Bar Chart)
  const clicksByBrowser = await Click.aggregate([
    { $match: { url: url._id, timestamp: { $gte: startDate } } },
    { $group: { _id: '$browser', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // 7. Aggregation Pipeline: Operating System distribution
  const clicksByOS = await Click.aggregate([
    { $match: { url: url._id, timestamp: { $gte: startDate } } },
    { $group: { _id: '$os', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // 8. Aggregation Pipeline: Referrer Source distribution (Bar/Barlist Chart)
  const clicksByReferrer = await Click.aggregate([
    { $match: { url: url._id, timestamp: { $gte: startDate } } },
    { $group: { _id: '$referrer', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // 9. Aggregation Pipeline: Country locations distribution (3D Globe / Table)
  const clicksByCountry = await Click.aggregate([
    { $match: { url: url._id, timestamp: { $gte: startDate } } },
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);

  // 10. Format and deliver the response payload
  res.status(200).json({
    success: true,
    analytics: {
      totalClicks: url.totalClicks,
      clicksInPeriod: clicks.length,
      period: `${days} days`,
      clicksByDate: clicksByDate.map((d) => ({
        date: d._id,
        clicks: d.count,
      })),
      clicksByDevice: clicksByDevice.map((d) => ({
        device: d._id,
        clicks: d.count,
      })),
      clicksByBrowser: clicksByBrowser.map((d) => ({
        browser: d._id,
        clicks: d.count,
      })),
      clicksByOS: clicksByOS.map((d) => ({
        os: d._id,
        clicks: d.count,
      })),
      clicksByReferrer: clicksByReferrer.map((d) => ({
        referrer: d._id,
        clicks: d.count,
      })),
      clicksByCountry: clicksByCountry.map((d) => ({
        country: d._id,
        clicks: d.count,
      })),
      recentClicks: clicks.slice(0, 50).map((c) => ({
        timestamp: c.timestamp,
        device: c.device,
        browser: c.browser,
        os: c.os,
        referrer: c.referrer,
        country: c.country,
        city: c.city,
      })),
    },
  });
});

// @desc    Get aggregate stats overview for the entire user profile (Main Dashboard view)
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = asyncHandler(async (req, res, next) => {
  // 1. Retrieve all links belonging to the authenticated user
  const userUrls = await Url.find({ user: req.user.id });
  const urlIds = userUrls.map((u) => u._id);

  // 2. Perform quick synchronous list summaries
  const totalLinks = userUrls.length;
  const activeLinks = userUrls.filter((u) => u.isActive).length;
  const totalClicks = userUrls.reduce((sum, u) => sum + u.totalClicks, 0);

  // 3. Query click count over the last 7 days for the dashboard "trending up" card
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentClicks = await Click.countDocuments({
    url: { $in: urlIds },
    timestamp: { $gte: weekAgo },
  });

  // 4. Query total clicks trend over the last 30 days (for the large dashboard Line chart)
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const clicksTrend = await Click.aggregate([
    {
      $match: {
        url: { $in: urlIds },
        timestamp: { $gte: monthAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 5. Construct a sorted array of the user's top-performing shortened URLs
  const topUrls = userUrls
    .sort((a, b) => b.totalClicks - a.totalClicks)
    .slice(0, 5)
    .map((u) => ({
      id: u._id,
      shortId: u.shortId,
      originalUrl: u.originalUrl,
      title: u.title,
      totalClicks: u.totalClicks,
    }));

  res.status(200).json({
    success: true,
    overview: {
      totalLinks,
      activeLinks,
      totalClicks,
      recentClicks,
      clicksTrend: clicksTrend.map((d) => ({
        date: d._id,
        clicks: d.count,
      })),
      topUrls,
    },
  });
});
