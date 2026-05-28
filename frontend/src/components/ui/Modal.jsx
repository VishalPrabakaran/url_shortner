import clsx from 'clsx';

export default function Modal({ isOpen, onClose, children, className = '' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-[#111111]/30 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative z-10 w-full max-w-lg', className)}>{children}</div>
    </div>
  );
}
