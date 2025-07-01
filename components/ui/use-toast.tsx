'use client';

import { useState, useEffect } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const defaultDuration = 3000;

export function toast({ title, description, variant = 'default', duration = defaultDuration }: ToastProps) {
  // Create toast element
  const toastContainer = document.createElement('div');
  toastContainer.className = `fixed bottom-4 right-4 z-50 max-w-md p-4 rounded-md shadow-lg transition-all transform translate-y-0 opacity-100 ${getVariantClass(variant)}`;
  
  // Create title element
  const titleElement = document.createElement('div');
  titleElement.className = 'font-medium';
  titleElement.textContent = title;
  toastContainer.appendChild(titleElement);
  
  // Create description element if provided
  if (description) {
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'text-sm opacity-90 mt-1';
    descriptionElement.textContent = description;
    toastContainer.appendChild(descriptionElement);
  }
  
  // Add to DOM
  document.body.appendChild(toastContainer);
  
  // Animate in
  setTimeout(() => {
    toastContainer.classList.add('translate-y-0');
    toastContainer.classList.remove('translate-y-2');
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    toastContainer.classList.add('opacity-0');
    toastContainer.classList.add('translate-y-2');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (document.body.contains(toastContainer)) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  }, duration);
}

function getVariantClass(variant: ToastVariant): string {
  switch (variant) {
    case 'destructive':
      return 'bg-red-600 text-white';
    case 'success':
      return 'bg-green-600 text-white';
    default:
      return 'bg-background border border-border';
  }
}