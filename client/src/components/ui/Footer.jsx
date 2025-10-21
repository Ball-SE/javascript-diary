import { Linkedin } from "lucide-react";
import { Instagram } from "lucide-react";
import { Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer(){

    return (
        <footer className="bg-[#EFEEEB] border-t border-[#DAD6D1] mt-auto w-full min-h-[144px] py-8 px-4 sm:py-12 sm:px-16 lg:px-24 xl:px-32">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 sm:gap-8">
                    {/* Get in touch section */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <p className="text-[#26231E] text-base font-medium">
                            Get in touch
                        </p>
                        <div className="flex items-center gap-4">
                            <Linkedin className="w-5 h-5 text-[#26231E] hover:text-[#1a1a1a] transition-colors duration-200 cursor-pointer" />
                            <Instagram className="w-5 h-5 text-[#26231E] hover:text-[#1a1a1a] transition-colors duration-200 cursor-pointer" />
                            <Twitter className="w-5 h-5 text-[#26231E] hover:text-[#1a1a1a] transition-colors duration-200 cursor-pointer" />
                        </div>
                    </div>

                    {/* Home Page link */}
                    <div className="flex justify-center sm:justify-end">
                        <Link 
                            to="/" 
                            className="text-[#26231E] text-base underline font-medium hover:text-[#1a1a1a] transition-colors duration-200"
                        >
                            Home Page
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}