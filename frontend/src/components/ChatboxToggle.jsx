import { MessageSquare, X } from 'lucide-react';

const ChatboxToggle = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className='fixed bottom-4 right-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40'
    >
      {isOpen ? (
        <X className='w-6 h-6' />
      ) : (
        <MessageSquare className='w-6 h-6' />
      )}
    </button>
  );
};
export default ChatboxToggle;
