import Modal from "../Shared/Modal";

interface MemberSearchDialogProps {
  wallet?: string;
  name?: string;
  type?: boolean;
}

const MemberSearchDialog = ({
  wallet,
  name,
  type,
}: MemberSearchDialogProps) => {
  return (
    <Modal id="search_dialog">
      {wallet != undefined ? (
        <>
          <ul className="steps steps-vertical">
            <li data-content="➤" className="step">
              <div>
                BitkubNext/เลขสมาชิก:{" "}
                <span className=" font-bold text-green-800">{wallet}</span>
              </div>
            </li>
            <li data-content="➤" className="step">
              <div>
                ชื่อ: <span className=" font-bold text-green-800">{name}</span>
              </div>
            </li>
            <li data-content="➤" className="step">
              <div>
                ประเภทสมาชิก:{" "}
                <span className="font-bold text-green-800">
                  {type ? "ตลอดชีพ" : "รายปี"}
                </span>
              </div>
            </li>
          </ul>
        </>
      ) : (
        <div className="font-bold">Not Found</div>
      )}
    </Modal>
  );
};
export default MemberSearchDialog;
