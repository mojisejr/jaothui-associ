interface GridCellProps {
  label: string;
  content?: string | number;
}
const GridCell = ({ label, content }: GridCellProps) => {
  return (
    <>
      <div className="col-span-2  border-b-[1px] border-slate-500 p-1 font-bold">
        {label}
      </div>
      <div className="col-span-3 flex justify-center border-b-[1px] border-slate-500 p-1">
        {content}
      </div>
    </>
  );
};

export default GridCell;
