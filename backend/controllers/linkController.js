import Link from '../models/Link.js';
import { nanoid } from 'nanoid';
import validUrl from 'valid-url';

// 1. CREATE SHORT URL
export const createLink = async (req, res) => {
  try {
    const { longUrl, title, alias, expiresAt } = req.body;

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({ message: 'Please provide a valid destination URL structure' });
    }

    let parsedExpiry;
    if (expiresAt) {
      parsedExpiry = new Date(expiresAt);
      if (Number.isNaN(parsedExpiry.getTime())) {
        return res.status(400).json({ message: 'Expiration date must be a valid date' });
      }
      if (parsedExpiry <= new Date()) {
        return res.status(400).json({ message: 'Expiration date must be in the future' });
      }
    }

    // Handle Custom Alias checks if the user provided one (Bonus feature support!)
    let shortCode;
    if (alias && alias.trim() !== '') {
      const aliasExists = await Link.findOne({ alias: alias.trim() });
      if (aliasExists) {
        return res.status(400).json({ message: 'This custom alias is already taken' });
      }
      shortCode = alias.trim();
    } else {
      // If no custom alias, generate a random unique 6-character short code
      shortCode = nanoid(6);
    }

    // Build and save the URL document to MongoDB bound to this specific user ID
    const newLink = await Link.create({
      userId: req.user._id,
      title: title || 'Untitled Link',
      longUrl,
      shortCode,
      alias: alias ? alias.trim() : undefined,
      expiresAt: parsedExpiry
    });

    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ message: 'Error generating shortened link', error: error.message });
  }
};

// 2. GET CURRENT USER'S LINKS
export const getUserLinks = async (req, res) => {
  try {
    // Each user should only manage their own shortened URLs
    const links = await Link.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user links', error: error.message });
  }
};

// 3. DELETE LINK
export const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Guardrail security check: Ensure the user trying to delete owns this link document
    if (link.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this asset' });
    }

    await link.deleteOne();
    res.status(200).json({ message: 'Shortened link completely purged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing link asset', error: error.message });
  }
};