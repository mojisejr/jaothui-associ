import { ReactNode } from "react";

interface ModalProps {
  id: string;
  children: ReactNode;
}
const Modal = ({ id, children }: ModalProps) => {
  return (
    <>
      <dialog id={id} className="modal modal-middle">
        <form method="dialog" className="modal-box">
          {children}
          <div className="modal-action">
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default Modal;
