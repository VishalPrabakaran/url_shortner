import { useState, useEffect } from 'react';

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

  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteLink, setSelectedDeleteLink] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);

        const data = await ApiClient.getLinks();

        setLinks(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleLinkCreated = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  const handleOpenAnalytics = (link) => {
    setSelectedAnalyticsLink(link);
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
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLinks = links.filter((link) => {
    const query = searchTerm.toLowerCase();

    return (
      link.title?.toLowerCase().includes(query) ||
      link.longUrl?.toLowerCase().includes(query) ||
      link.shortUrl?.toLowerCase().includes(query) ||
      link.alias?.toLowerCase().includes(query)
    );
  });

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
        isOpen={!!selectedAnalyticsLink}
        onClose={() => setSelectedAnalyticsLink(null)}
        link={selectedAnalyticsLink}
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