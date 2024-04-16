import Link from "next/link";
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
          href="https://www.facebook.com/ThaiBuffaloCD?mibextid=2JQ9oc"
        >
          Facebook
        </Link>
        <Link
          className="hover:text-thuiyellow flex items-center gap-[20px] transition-[2s]"
          href="https://dld.go.th/th/index.php/th/"
        >
          กรมปศุสัตว์
        </Link>
        <Link
          className="hover:text-thuiyellow flex items-center gap-[20px] transition-[2s]"
          href="https://ag-ebook.lib.ku.ac.th/org-shelf/dld.php"
        >
          E-book กรมปศุสัตว์
        </Link>
      </div>
    </motion.div>
  );
};

export default Footer;
