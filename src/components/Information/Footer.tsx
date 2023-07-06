import Link from "next/link";
import { AiFillFacebook, AiFillTwitterCircle } from "react-icons/ai";
import { SiDiscord } from "react-icons/si";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div className="h-full w-full bg-black p-10 text-white">
      <div className="flex items-center gap-10">
        <div className="flex-none text-[35px]">FOLLOW US</div>
        <div className="flex-1 border-b-[3px]"></div>
      </div>
      <div className="mt-[10px] flex flex-col gap-[20px]">
        <Link
          className="hover:text-thuiyellow flex items-center gap-[20px] transition-[2s]"
          href="https://www.facebook.com/jaothui"
        >
          <AiFillFacebook size={50} /> Facebook
        </Link>
        <Link
          className="hover:text-thuiyellow flex items-center gap-[20px] transition-[2s]"
          href="https://twitter.com/jaothui_nft"
        >
          <AiFillTwitterCircle size={50} /> Twitter
        </Link>
        <Link
          className="hover:text-thuiyellow flex items-center gap-[20px] transition-[2s]"
          href="https://discord.gg/tPZYZ5rjc7"
        >
          <SiDiscord size={50} /> Discord
        </Link>
      </div>
    </motion.div>
  );
};

export default Footer;
