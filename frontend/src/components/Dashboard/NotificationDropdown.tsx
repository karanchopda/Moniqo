"use client";

import React from 'react';

export interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: string;
  icon: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onItemClick: (id: number) => void;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onItemClick,
}: NotificationDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop helper to close */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Notifications Dropdown Popup */}
      <div className="absolute right-0 top-11 w-80 bg-white border border-gray-150 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
          <h4 className="text-xs font-black text-primary">Notifications</h4>
          <button 
            onClick={onMarkAllRead}
            className="text-[9px] font-black text-[#0a5c43] hover:underline uppercase tracking-wider outline-none"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100/60 pt-1">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onItemClick(item.id)}
                className={`py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50/50 rounded-lg px-2 transition-all ${
                  !item.read ? 'bg-[#e6f4ee]/20' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  item.type === 'success' ? 'bg-emerald-50 text-[#0a5c43]' :
                  item.type === 'warning' ? 'bg-rose-50 text-rose-500' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <p className={`text-[10px] truncate leading-normal ${!item.read ? 'font-black text-primary' : 'font-semibold text-gray-500'}`}>
                      {item.title}
                    </p>
                    <span className="text-[8px] font-bold text-gray-400 shrink-0 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-[9px] font-semibold text-gray-400 leading-normal mt-0.5 break-words">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-2xl text-gray-300">notifications_off</span>
              <p className="text-[10px] font-bold text-gray-400 mt-1">No notifications</p>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 my-2"></div>
        
        <button className="w-full text-center py-1 text-[9px] font-black text-[#0a5c43] hover:underline uppercase tracking-wider outline-none">
          View all notifications
        </button>
      </div>
    </>
  );
}
