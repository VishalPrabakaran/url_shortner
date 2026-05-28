import { Trash2, X, AlertTriangle } from 'lucide-react';
import Button from './ui/Button';
import Modal from './ui/Modal';

export default function DeleteModal({ isOpen, onClose, onConfirm, linkTitle }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-xl border border-[#EAEAEA]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-[#111111]"
          aria-label="Close modal"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Delete Short Link</h3>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Confirm Permanent Action</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-[#666666]">
            Are you sure you want to delete <span className="font-semibold text-[#111111]">"{linkTitle}"</span>? This will permanently remove the short URL and delete all historical visitor analytics.
          </p>
          <div className="rounded-2xl border border-red-100/70 bg-red-50/60 p-3 text-[11px] text-red-800">
            <strong>Warning:</strong> Once deleted, traffic attempting to visit this short link will receive a 404 error page. This action cannot be undone.
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
}
