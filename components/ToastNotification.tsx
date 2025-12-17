import React from 'react';

interface ToastNotificationProps {
    message: string;
    isVisible: boolean;
    actionLabel?: string;
    onAction?: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, isVisible, actionLabel, onAction }) => {
    return (
        <div className={`fixed bottom-5 right-5 z-50 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="bg-black text-white px-6 py-4 rounded-sm shadow-2xl flex items-center justify-between min-w-[300px] max-w-md">
                <span className="text-sm tracking-wide font-medium mr-4">{message}</span>
                
                {actionLabel && onAction && (
                    <button 
                        onClick={onAction}
                        className="text-xs font-bold uppercase tracking-widest border-b border-white pb-0.5 hover:opacity-70 transition-opacity whitespace-nowrap"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ToastNotification;