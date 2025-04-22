import { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Notification = ({ message, type, onClose, duration = 5000 }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-primary',
  }[type];

  return (
    <div 
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md text-white transition-opacity duration-300 ${bgColor} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center">
        <p className="mr-8">{message}</p>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};
