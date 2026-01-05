'use client';

import { useState, useEffect } from 'react';

export default function VogueStyleEmailCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // Effect to control body scroll locking
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  useEffect(() => {
    const hasBeenDismissed = sessionStorage.getItem('popupDismissed');
    const subscribedStatus = sessionStorage.getItem('hasSubscribed');

    if (subscribedStatus === 'true' || hasBeenDismissed === 'true') {
      setHasSubscribed(subscribedStatus === 'true');
      return;
    }

    // Show popup logic
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 50);
    }, 3000);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      if (scrollPosition > (documentHeight * 0.4 - windowHeight)) {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 50);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 50);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email || !email.includes('@')) {
      return; // Basic validation
    }

    setIsSubmitted(true);
    setHasSubscribed(true);
    sessionStorage.setItem('hasSubscribed', 'true');

    setTimeout(() => {
      closePopup();
    }, 2000);
  };

  const closePopup = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('popupDismissed', 'true');
      setIsSubmitted(false); // Reset for next time if needed, though hidden
      setEmail('');
    }, 400);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${isAnimating ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none pointer-events-none'}`}>
      <div
        className={`relative w-full max-w-md mx-4 bg-[#fcfbf9] text-black shadow-2xl transform transition-all duration-500 ease-out 
          ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'} 
          border-t-4 border-red-600`}
      >
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 p-2 z-10 text-gray-400 hover:text-black transition-colors"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-8 md:p-10 text-center border-x border-b border-gray-200">
          <div className="mb-6">
            <span className="font-newyorker text-red-600 text-xs tracking-[0.2em] uppercase block mb-3">
              The Newsletter
            </span>
            <h2 className="text-3xl md:text-4xl font-newyorker font-bold tracking-tight mb-4">
              KiawaNotes
            </h2>
            <p className="text-lg font-acaslon italic text-gray-600 leading-relaxed max-w-xs mx-auto">
              "The most essential reading of the week, delivered directly to you."
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full py-3 px-0 border-b border-gray-300 bg-transparent text-center font-acaslon text-lg placeholder:text-gray-400 focus:outline-none focus:border-black focus:placeholder:text-gray-200 transition-all rounded-none"
                  autoFocus
                />

                <button
                  type="submit"
                  className="w-full py-3 px-6 mt-2 bg-black text-white font-futura uppercase tracking-widest text-xs font-bold hover:bg-neutral-800 transition-all duration-300 border border-transparent hover:border-black"
                >
                  Join the List
                </button>
              </div>

              <p className="mt-4 text-[10px] text-gray-400 font-glacial tracking-wide uppercase">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            <div className="py-8 animate-in fade-in duration-500">
              <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="font-newyorker text-2xl mb-2">Welcome Aboard</h3>
              <p className="font-acaslon text-gray-600">You're on the list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}