'use client';

import { useState, useEffect } from 'react';

export default function VogueStyleEmailCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastDismissed, setLastDismissed] = useState(null);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // Effect to control body scroll locking
  useEffect(() => {
    if (isVisible) {
      // Lock scrolling when popup is visible
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling when popup is hidden
      document.body.style.overflow = 'auto';
    }

    // Cleanup: always restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  useEffect(() => {
    // Check if the popup has been shown in this session
    const hasShown = sessionStorage.getItem('popupShown');
    const subscribedStatus = sessionStorage.getItem('hasSubscribed');
    
    if (subscribedStatus === 'true') {
      setHasSubscribed(true);
      return; // Don't show popup again if user has subscribed
    }
    
    if (!hasShown) {
      // Show popup after 5 seconds of page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      
      // Or show popup when user scrolls 60% down the page
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        
        if (scrollPosition > (documentHeight * 0.6 - windowHeight)) {
          setIsVisible(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Exit intent detection (user moving mouse to top of page quickly)
      const handleMouseLeave = (e) => {
        if (e.clientY <= 0) {
          setIsVisible(true);
          document.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
      
      document.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Timer to reshow popup after 1 minute if just dismissed with X
  useEffect(() => {
    // Only set up timer if user dismissed popup but hasn't subscribed
    if (lastDismissed && !hasSubscribed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 60000); // 60000ms = 1 minute
      
      return () => clearTimeout(timer);
    }
  }, [lastDismissed, hasSubscribed]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      return;
    }
    
    // Here you would typically handle the submission to your newsletter service
    console.log('Subscribing email:', email);
    setIsSubmitted(true);
    setEmail('');
    setHasSubscribed(true);
    // Set flag that user has subscribed
    sessionStorage.setItem('hasSubscribed', 'true');
    
    // Reset submission state after 3 seconds and allow scrolling again
    setTimeout(() => {
      setIsSubmitted(false);
      setIsVisible(false);
      sessionStorage.setItem('popupShown', 'true');
    }, 3000);
  };

  const closePopup = () => {
    setIsVisible(false);
    setLastDismissed(Date.now());
    // Only mark as shown, but we'll show it again after 1 minute
    sessionStorage.setItem('popupShown', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4">
      <div className="relative max-w-4xl w-full max-h-[90vh] bg-black text-white shadow-2xl animate-fadeIn overflow-hidden">
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-1"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Image Section - Left Half */}
          <div className="w-full md:w-1/2 relative">
            <img 
              src="/popup.jpg" 
              alt="Popup Image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          {/* Content Section - Right Half */}
          <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif uppercase tracking-wider mb-3">
                NEWSLETTER
              </h2>
              <div className="w-12 h-0.5 bg-red-600 mx-auto mb-4 md:mb-6"></div>
              <p className="text-base md:text-lg lg:text-xl font-light mb-6 md:mb-8 font-glacial leading-relaxed">
                Sign up for our newsletter to receive the latest culinary stories, exclusive recipes, and chef insights.
              </p>
            </div>

            <div className="w-full">
              <div className="flex flex-col gap-4 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full py-3 px-4 bg-transparent border border-white text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-white text-sm md:text-base"
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 px-6 bg-white text-black uppercase tracking-widest text-xs md:text-sm font-medium hover:bg-gray-200 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
              
              {isSubmitted && (
                <div className="mb-4 text-center text-green-400 text-sm md:text-base">
                  Thank you for subscribing!
                </div>
              )}
              
              <div className="text-center text-xs text-gray-300 leading-relaxed">
                By signing up you agree to our{' '}
                <span className="underline cursor-pointer hover:text-white transition-colors">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="underline cursor-pointer hover:text-white transition-colors">
                  Privacy Policy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}