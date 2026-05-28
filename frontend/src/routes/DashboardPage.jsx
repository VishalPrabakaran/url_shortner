import { useState, useEffect, useMemo, useRef } from 'react';

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ShortenerForm from '../components/ShortenerForm';
import LinkGrid from '../components/LinkGrid';
import AnalyticsDrawer from '../components/AnalyticsDrawer';
import DeleteModal from '../components/DeleteModal';

import { ApiClient } from '../services/api';

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const prevLinksRef = useRef([]);

  // Track ONLY the ID to ensure your analytics view re-evaluates 
  // correctly during live background refreshes
  const [selectedAnalyticsLinkId, setSelectedAnalyticsLinkId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteLink, setSelectedDeleteLink] = useState(null);

  const areLinksEqual = (prev, next) => {
    if (!Array.isArray(prev) || !Array.isArray(next) || prev.length !== next.length) {
      return false;
    }

    return prev.every((item, index) => {
      const nextItem = next[index];
      return (
        item.id === nextItem.id &&
        item.title === nextItem.title &&
        item.longUrl === nextItem.longUrl &&
        item.shortUrl === nextItem.shortUrl &&
        item.clicks === nextItem.clicks
      );
    });
  };

  useEffect(() => {
    const fetchLinks = async (showLoader = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const data = await ApiClient.getLinks();
        const nextLinks = data || [];

        if (!areLinksEqual(prevLinksRef.current, nextLinks)) {
          prevLinksRef.current = nextLinks;
          setLinks(nextLinks);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    };

    fetchLinks(true);

    const interval = setInterval(() => {
      fetchLinks(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLinkCreated = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  const handleOpenAnalytics = (link) => {
    setSelectedAnalyticsLinkId(link.id || link._id);
  };

  const handleDeleteClick = (link) => {
    setSelectedDeleteLink(link);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteLink) return;

    try {
      await ApiClient.deleteLink(selectedDeleteLink.id);

      setLinks((prev) =>
        prev.filter((link) => link.id !== selectedDeleteLink.id)
      );

      setDeleteModalOpen(false);
      setSelectedDeleteLink(null);
      if (selectedAnalyticsLinkId === selectedDeleteLink.id) {
        setSelectedAnalyticsLinkId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLinks = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return links.filter((link) =>
      link.title?.toLowerCase().includes(query) ||
      link.longUrl?.toLowerCase().includes(query) ||
      link.shortUrl?.toLowerCase().includes(query) ||
      link.alias?.toLowerCase().includes(query)
    );
  }, [links, searchTerm]);

  // Derived state is memoized so analytics only refresh when the selected link id changes.
  const liveAnalyticsLink = useMemo(
    () => links.find((l) => l.id === selectedAnalyticsLinkId) || null,
    [links, selectedAnalyticsLinkId]
  );

  return (
    <div className="min-h-screen bg-[#F9F9FA]">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <HeroSection />

      <ShortenerForm
        onLinkCreated={handleLinkCreated}
      />

      <LinkGrid
        links={filteredLinks}
        loading={loading}
        onOpenAnalytics={handleOpenAnalytics}
        onDeleteClick={handleDeleteClick}
      />

      <AnalyticsDrawer
        isOpen={!!selectedAnalyticsLinkId}
        onClose={() => setSelectedAnalyticsLinkId(null)}
        link={liveAnalyticsLink}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDeleteLink(null);
        }}
        onConfirm={handleConfirmDelete}
        linkTitle={selectedDeleteLink?.title}
      />
    </div>
  );
}