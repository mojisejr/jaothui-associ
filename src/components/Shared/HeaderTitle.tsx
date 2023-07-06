interface HeaderTitleProps {
  text: string;
}
const HeaderTitle = ({ text }: HeaderTitleProps) => {
  return (
    <div
      style={{ fontFamily: "Kanit" }}
      className="text-[2rem] w1024:text-[3rem]"
    >
      {text}
    </div>
  );
};

export default HeaderTitle;
