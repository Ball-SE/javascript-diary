
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
        <img src="src/assets/images/image.jpg" alt="Hero Image" className="w-[400px] h-[453px] rounded-2xl" />
        
        <div className="w-[347px] h-[284px] gap-[12px] ">
          <div>
            <p className="text-[#75716B] text-[12px] font-medium text-left">
              - Author
            </p>
            <h3 className="text-[#43403B] text-[24px] font-semibold text-left">
              Thompson P.
            </h3>
          </div>
          <p className="text-[#75716B] text-[16px] font-medium text-left">
          I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. <br/>
          <br/>
          When i’m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
          </p>
        </div>
      </section>
    )
  }
