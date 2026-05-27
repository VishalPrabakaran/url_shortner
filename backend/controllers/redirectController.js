import Link from '../models/Link.js';

export const handleRedirect = async (req, res) => {
  try {
    const { code } = req.params;

    // Detect basic device and browser details from user-agent string metadata (Bonus!)
    const userAgent = req.headers['user-agent'] || '';
    let device = 'Desktop';
    if (/mobile/i.test(userAgent)) device = 'Mobile';
    if (/tablet/i.test(userAgent)) device = 'Tablet';

    let browser = 'Unknown Browser';
    if (/chrome|crios/i.test(userAgent)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Safari';
    else if (/edge/i.test(userAgent)) browser = 'Edge';

    // 1. Locate the link object matching either standard code OR the custom alias string
    const link = await Link.findOneAndUpdate(
      { $or: [{ shortCode: code }, { alias: code }] },
      {
        $inc: { clicks: 1 }, // Atomically bump global click counter metrics
        $set: { lastVisited: new Date() },
        $push: {
          visits: {
            timestamp: new Date(),
            browser,
            device
          }
        }
      },
      { new: true }
    );

    if (!link) {
      return res.status(404).send('<h1>Error 404: Short link not found or expired</h1>');
    }

    // 2. Perform server-side redirect handling direct to client original web target
    return res.redirect(link.longUrl);
  } catch (error) {
    res.status(500).send('Server Error during click routing');
  }
};