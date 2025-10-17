const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* shadcn-like backdrop */}
      <div className='fixed inset-0 bg-black/80' onClick={onClose} />

      {/* shadcn-like modal */}
      <div className='relative z-50 w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg border'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <button
            onClick={onClose}
            className='rounded-sm opacity-70 hover:opacity-100'
          >
            ×
          </button>
        </div>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
