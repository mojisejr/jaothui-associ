import React from "react";
import Modal from "./Modal";
import Loading from "./LoadingIndicator";

interface LoadingDialogProps {
  title?: string;
  message?: string;
  indicator?: boolean;
}

const LoadingDialog = ({
  title,
  message = "กำลังโหลด",
  indicator = true,
}: LoadingDialogProps) => {
  return (
    <dialog id="loading_dialog" className="modal modal-middle">
      <div className="modal-box grid grid-cols-1 place-items-center gap-2">
        <div className="text-xl font-bold">{title}</div>
        <div className="font-bold">{message}</div>
        {indicator ? (
          <div>
            <Loading />
          </div>
        ) : null}
      </div>
    </dialog>
  );
};

export default LoadingDialog;
