import Image from "next/image";

export default function WeekendEssayHeader() {
  return (
    <div className="max-w-[72rem] mx-auto px-9 md:px-0">
      <div className="weekend-essay-top-banner">
        <div className="weekend-essay-top-gif-wrapper">
          <Image 
            src="/scroll.gif" 
            alt="Divider scroll" 
            width={800} 
            height={400} 
            className="weekend-essay-top-gif" 
            unoptimized 
          />
        </div>
        <div className="weekend-essay-top-text">
          <h3 className="font-newyorker text-black  text-2xl uppercase md-4 mb-4">
            "WHAT WE'RE READING THIS WEEKEND"
          </h3>
          <p className="font-acaslon text-gray-700 text-base md:text-xl max-w-lg mx-auto">
            A book of essays that explores what we want from the lives that we secretly imagine for ourselves; an engrossing novel that follows a teen-age girl in working-class Tokyo as she desperately tries to achieve financial stability; and more.
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
