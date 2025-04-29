  "use client"
  import Image from "next/image";
import { Button } from "@/components/ui/button";
  import Footer from "@/components/Footer";
  import { IoIosArrowDropleftCircle } from "react-icons/io";
  import { IoIosArrowDroprightCircle } from "react-icons/io";

  export default function CommunityPageExample() {
    return (
      <main className="mt-40 flex flex-col items-center justify-center text-center">
        <Image src="/cube-icon.png" alt="logo" width={100} height={100} className="rounded-2xl mb-4 w-25 h-25 shadow-[10px_10px_40px_rgba(0,0,0,0.6)]" />

        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
          Learn to code the right way!
        </h1>
        <p className="text-2xl font-regular tracking-tight opacity-70 mt-4">
          We are a community of people who are passionate about learning and
          sharing knowledge.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg w-220 h-118 mt-10 ">
    
          
        </div>
        
        <div className="flex gap-4">
      
        <div>
        <IoIosArrowDropleftCircle className="w-13 h-13 shadow:lg text-blue-600 mb-4 mt-34 mr-10" />
        </div >
        
        <div className="bg-gray-300 border-gray-200 rounded-xl p-6  shadow-[8px_8px_09px_rgba(0,0,0,0.2)] w-52 h-49 mt-10">
        </div>
          <div className="bg-gray-300 border-gray-200 rounded-xl p-6 shadow-[8px_8px_09px_rgba(0,0,0,0.2)] w-52 h-49 mt-10">
          </div>
          <div className="bg-gray-300 border-gray-200 rounded-xl p-6 shadow-[8px_8px_09px_rgba(0,0,0,0.2)] w-52 h-49 mt-10">
          </div>
        <div className="bg-gray-300 border-gray-200 rounded-xl p-6 shadow-[8px_8px_09px_rgba(0,0,0,0.2)] w-52 h-49 mt-10">
        </div>
        <div>
          
        <IoIosArrowDroprightCircle className="w-13 h-13 text-blue-600 mb-4 mt-34 mr-10" />
        </div>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-sky-400 text-white px-12 py-7 rounded-2xl mt-10 text-2xl font-bold">
          Join the community
        </Button>
        <div>
          <p className=" text-lg tracking-tight font-regular opacity-50 mb-20">Only for $99/month • Cancel anytime</p>
        </div>
      <Footer />
      
      </main>
    );
  }


