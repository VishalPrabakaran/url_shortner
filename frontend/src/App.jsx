import { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ShortenerForm from './components/ShortenerForm';
import LinkGrid from './components/LinkGrid';
import AnalyticsDrawer from './components/AnalyticsDrawer';
import DeleteModal from './components/DeleteModal';
import AuthPortal from './components/AuthPortal';

import { useAuth } from './context/AuthContext';
import { ApiClient } from './services/api';

export default function App() {
  const { user } = useAuth();

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteLink, setSelectedDeleteLink] = useState(null);

  // Load Links
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);

        const data = await ApiClient.getLinks();

        setLinks(data || []);
      } catch (err) {
        console.error('Failed to load links:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLinks();
    }
  }, [user]);

  // Create new link
  const handleLinkCreated = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  // Open analytics drawer
  const handleOpenAnalytics = (link) => {
    setSelectedAnalyticsLink(link);
  };

  // Open delete modal
  const handleDeleteClick = (link) => {
    setSelectedDeleteLink(link);
    setDeleteModalOpen(true);
  };

  // Confirm delete
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
      console.error('Failed to delete link:', err);
    }
  };

  // Search filtering
  const filteredLinks = links.filter((link) => {
    const query = searchTerm.toLowerCase();

    return (
      link.title?.toLowerCase().includes(query) ||
      link.longUrl?.toLowerCase().includes(query) ||
      link.shortUrl?.toLowerCase().includes(query) ||
      link.alias?.toLowerCase().includes(query)
    );
  });

  // If not authenticated
  if (!user) {
    return <AuthPortal />;
  }

  return (
    <div className="min-h-screen bg-[#F9F9FA]">
      
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Hero */}
      <HeroSection />

      {/* Form */}
      <ShortenerForm
        onLinkCreated={handleLinkCreated}
      />

      {/* Links Grid */}
      <LinkGrid
        links={filteredLinks}
        loading={loading}
        onOpenAnalytics={handleOpenAnalytics}
        onDeleteClick={handleDeleteClick}
      />

      {/* Analytics Drawer */}
      <AnalyticsDrawer
        isOpen={!!selectedAnalyticsLink}
        onClose={() => setSelectedAnalyticsLink(null)}
        link={selectedAnalyticsLink}
      />

      {/* Delete Modal */}
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