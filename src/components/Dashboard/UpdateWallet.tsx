import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import AlertMessageDialog from "../Shared/AlertMessageDialog";

const UpdateWallet = () => {
  const [alertTitle, setAlertTitle] = useState<string>("No Title");
  const [alertMessage, setAlertMessage] = useState<string>("No Message");
  const { data: memberData, mutate: getMember } =
    api.user.getMemberId.useMutation();

  const {
    data: updatedWallet,
    mutate: updateWallet,
    isSuccess: walletUpdated,
    isError: walletUpdateError,
    error,
  } = api.user.updateWallet.useMutation();

  const memberIdRef = useRef<HTMLInputElement>(null);
  const walletRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef<HTMLInputElement>(null);
  const memberIdSearch = () => {
    const id = memberIdRef.current?.value;
    getMember({ memberId: id! });
  };

  const walletUpdate = () => {
    const id = memberIdRef.current?.value;
    const wallet = walletRef.current?.value;
    const password = keyRef.current?.value;

    if (!id || !wallet) return;

    updateWallet({ memberId: id, wallet, key: password! });
  };

  useEffect(() => {
    if (walletUpdated) {
      toast.success("wallet update เสร็จสิ้น");
      handleAlertMessage("Wallet Update", "Update Wallet สำเร็จ");
    }

    if (walletUpdateError) {
      toast.error("wallet update ไม่สำเร็จ");
      handleAlertMessage("Wallet Update", "Update Wallet ไม่สำเร็จ");
    }
  }, [walletUpdated, walletUpdateError]);

  const handleAlertMessage = (title: string, message: string) => {
    setAlertMessage(title);
    setAlertTitle(message);
    window.alert_message_dialog.showModal();
  };

  return (
    <div className="px-3">
      <div className="form-control">
        <div className="flex gap-2">
          <input
            ref={memberIdRef}
            type="text"
            placeholder="memberId แบบเดิม eg. H00x"
            className="input-bordered input input-xs max-w-xs"
          />
          <button
            onClick={() => void memberIdSearch()}
            className="btn-primary btn-xs btn"
          >
            ค้นหา
          </button>
        </div>
      </div>
      {memberData ? (
        <div className="grid grid-cols-2">
          <div>Id: </div>
          <div>{memberData.wallet}</div>
          <div>ชื่อ: </div>
          <div>{memberData.name}</div>
          <div>
            <div className="form-control">
              <div className="flex gap-2">
                <input
                  ref={walletRef}
                  type="text"
                  placeholder="เลข wallet (0x..)"
                  className="input-bordered input input-xs max-w-xs"
                />
                <input
                  ref={keyRef}
                  type="password"
                  placeholder="รหัส"
                  className="input-bordered input input-xs max-w-xs"
                />
                <button
                  onClick={() => void walletUpdate()}
                  className="btn-primary btn-xs btn"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>ไม่เจอ</div>
      )}
      <AlertMessageDialog title={alertTitle} message={alertMessage} />
    </div>
  );
};

export default UpdateWallet;
