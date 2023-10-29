import { ReactNode } from "react";

interface ModalProps {
  id: string;
  children: ReactNode;
}
const Modal = ({ id, children }: ModalProps) => {
  return (
    <>
      <dialog id={id} className="modal modal-middle"> 
        <div className="modal-box">
          {children}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
