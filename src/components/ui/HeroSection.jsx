
function HeroSection(){
    return (
      <section className="w-[1200px] h-[529px] gap-[60px] flex justify-between items-center pt-20 mx-auto">
        <div className="w-[347px] h-[276px] gap-[24px] text-right">
        <h1 className="text-[#26231E] text-[52px] font-semibold">
          Stay <br/>
          Informed, <br/>
          Stay Inspired
        </h1>
        <p className="text-[#75716B] text-[16px] font-medium">
          Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
        </p>
        </div>
        <img src="src/assets/images/image.jpg" alt="Hero Image" className="w-[386px] h-[529px] rounded-2xl" />
        <div className="w-[347px] h-[284px] gap-[12px] ">
          <div>
            <p className="text-[#75716B] text-[12px] font-medium text-left">
              -Author
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

export default HeroSection;