"use client";

import React from 'react';
import Link from 'next/link';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  displayUserName: string;
  profileImageUrl: string;
  onLogout: () => void;
}

export default function ProfileDropdown({
  isOpen,
  onClose,
  displayUserName,
  profileImageUrl,
  onLogout,
}: ProfileDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop helper to close */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      <div className="absolute right-0 top-11 w-64 bg-white border border-gray-150 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        {/* User Profile Header */}
        <div className="flex items-center gap-3">
          <img 
            src={profileImageUrl} 
            alt="User profile large" 
            className="w-11 h-11 rounded object-cover border border-gray-100 shadow-sm"
          />
          <div>
            <h4 className="text-xs font-black text-primary leading-tight">{displayUserName}</h4>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-3"></div>

        {/* Menu Links */}
        <div className="space-y-1">
          <Link 
            href="/dashboard" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded text-gray-600 hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            <span className="material-symbols-outlined text-gray-400 text-[18px]">person</span>
            View Profile
          </Link>
          <Link 
            href="/dashboard" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded text-gray-600 hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            <span className="material-symbols-outlined text-gray-400 text-[18px]">settings</span>
            Account Settings
          </Link>
          <Link 
            href="/dashboard" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded text-gray-600 hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            <span className="material-symbols-outlined text-gray-400 text-[18px]">credit_card</span>
            Subscription Plan
          </Link>
        </div>

        <div className="h-px bg-gray-100 my-3"></div>

        {/* Red Logout Button */}
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-red-600 hover:bg-red-50/50 transition-colors text-xs font-bold text-left outline-none"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </>
  );
}
