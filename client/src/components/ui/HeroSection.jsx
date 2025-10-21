import heroImage from "../../assets/images/people.png";

export function HeroSection(){
    return (
      <section className="w-[375px] h-[1098px] top-[48px] pt-[48px] pr-[16px] pb-[40px] pl-[16px] gap-[40px] sm:w-[1200px] sm:h-[529px] sm:gap-[60px] flex flex-col sm:flex-row justify-center sm:justify-between sm:items-center sm:pt-20 mx-auto">
        <div className="w-[360px] h-[276px] gap-[24px] text-center sm:text-right">
        <h1 className="hidden sm:block text-[#26231E] text-[52px] font-semibold">
          Stay <br />
          Informed, <br/>
          Stay Inspired
        </h1>
        <h1 className="sm:hidden text-[#26231E] text-[40px] font-semibold">
          Stay Informed, <br/>
          Stay Inspired
        </h1>
        <p className="text-[#75716B] text-[16px] font-medium">
          Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
        </p>
        </div>
        <img src={heroImage} alt="Hero Image" className="w-[400px] h-[453px] rounded-2xl object-cover" />
        
        <div className="w-[347px] h-[284px] gap-[12px] ">
          <div>
            <p className="text-[#75716B] text-[12px] font-medium text-left">
              - Author
            </p>
            <h3 className="text-[#43403B] text-[24px] font-semibold text-left">
              Pharnuwat P.
            </h3>
          </div>
          <p className="text-[#75716B] text-[16px] font-medium text-left">
          I am a passionate JavaScript developer and technical writer who specializes in modern web development technologies. With extensive experience in React, Node.js, and full-stack development, I enjoy sharing practical coding insights and best practices. <br/>
          <br/>
          When I'm not coding, I spend time contributing to open-source projects and helping fellow developers master JavaScript fundamentals and advanced concepts.
          </p>
        </div>
      </section>
    )
  }
