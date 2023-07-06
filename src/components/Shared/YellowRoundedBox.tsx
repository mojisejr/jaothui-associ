import type { ReactNode } from "react";
interface BoxProps {
  children: ReactNode;
}

const YellowRoundedBox = ({ children }: BoxProps) => {
  return (
    <>
      <div className="max-h-[138px] max-w-[300px] rounded-md bg-[#F8E792]">
        {children}
      </div>
    </>
  );
};

export default YellowRoundedBox;
