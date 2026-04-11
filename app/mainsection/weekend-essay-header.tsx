import Image from "next/image";

export default function WeekendEssayHeader() {
  return (
    <div className="max-w-[72rem] mx-auto px-9 md:px-0 lg:px-24">
      <div className="weekend-essay-top-banner">
        <div className="weekend-essay-top-gif-wrapper">
          <Image 
            src="/scrollgif.gif" 
            alt="Divider scroll" 
            width={800} 
            height={400} 
            className="weekend-essay-top-gif" 
            unoptimized 
          />
        </div>
        <div className="weekend-essay-top-text">
          <h3 className="font-newyorker text-black  text-2xl uppercase md-4 mb-4">
            "WHAT WE'RE CURRENTLY READING"
          </h3>
          <p className="font-acaslon text-gray-700 text-base md:text-xl max-w-lg mx-auto">
           The US-Israel war on Iran enters its 38th day as Trump's deadline for the Strait of Hormuz expires tonight — and Tehran shows no signs of backing down.
          </p>
        </div>
      </div>
      
      <style>{`
        .weekend-essay-top-banner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
          margin-top: 8rem;
          margin-bottom: 14rem;
        }

        @media (min-width: 768px) {
          .weekend-essay-top-banner {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }

        .weekend-essay-top-gif-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .weekend-essay-top-gif {
          width: 100%;
          height: auto;
          max-height: 250px;
          object-fit: contain;
        }

        .weekend-essay-top-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
