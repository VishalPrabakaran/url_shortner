import { Trash2, X, AlertTriangle } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, linkTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-[#111111]/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all border border-[#EAEAEA] mx-4">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#111111] transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              Delete Short Link
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              Confirm Permanent Action
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-[13px] text-[#666666] leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-[#111111]">"{linkTitle}"</span>? This will permanently remove the short URL and delete all historical visitor analytics.
          </p>
          
          <div className="rounded bg-red-50/50 border border-red-100/50 p-3 text-[11px] text-red-800 leading-relaxed">
            <strong>Warning:</strong> Once deleted, traffic attempting to visit this short link will receive a 404 error page. This action cannot be undone.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#EAEAEA] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#111111] hover:border-gray-300 transition-colors focus:outline-none"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center space-x-2 rounded-md bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors focus:outline-none shadow-sm"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
}
