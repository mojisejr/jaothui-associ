import { type Address } from "viem";
import Modal from "../../Shared/Modal";
import { useEffect, useRef } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import Loading from "../../Shared/LoadingIndicator";

const CertificateApprovementDialog = ({
  microchip,
  hasApproveData,
}: {
  microchip: string;
  hasApproveData: boolean;
}) => {
  const { wallet } = useBitkubNext();
  const {
    mutate: approve,
    isLoading: approving,
    isSuccess: approved,
    isError: approvingError,
  } = api.certification.approve.useMutation();

  const {
    mutate: approveNoData,
    isLoading: approvingNoData,
    isSuccess: approvedNoData,
    isError: approvingErrorNoData,
  } = api.certification.approveNoData.useMutation();

  const { refetch } = api.certification.getAllMetadata.useQuery({
    wallet: wallet as string,
  });

  const bornAtRef = useRef<HTMLInputElement>(null);
  const ownerRef = useRef<HTMLInputElement>(null);

  function handleApprove() {
    const bornAt = bornAtRef.current?.value ?? "N/A";
    const owner = ownerRef.current?.value ?? "N/A";
    approve({ wallet: wallet!, microchip, owner, bornAt });
  }

  function handleApproveNoData() {
    approveNoData({ wallet: wallet!, microchip });
  }

  useEffect(() => {
    if (approved || approvedNoData) {
      void refetch();
      toast.success(`${microchip} Approved!`);
      window.certificate_approve_dialog.close();
    }

    if (approvingError || approvingErrorNoData) {
      toast.error(`Error on approving ${microchip}`);
      window.certificate_approve_dialog.close();
    }
  }, [approved, approvedNoData, approvingError, approvingErrorNoData]);

  return (
    <Modal id="certificate_approve_dialog">
      <div className="p-2">Microchip: {microchip}</div>
      <div className="join-vertical join w-full">
        {hasApproveData ? (
          <>
            <input
              disabled={approving}
              className="input-bordered input join-item"
              type="text"
              placeholder="สถานที่เกิด"
              ref={bornAtRef}
            />
            <input
              disabled={approving}
              className="input-bordered input join-item"
              type="text"
              placeholder="bitkub-next เจ้าของ"
              ref={ownerRef}
            />
            <button
              disabled={approving}
              onClick={handleApprove}
              className="btn-info join-item btn"
            >
              {!approving ? (
                "Approve"
              ) : (
                <div className="flex items-center gap-2">
                  <Loading /> Approving...
                </div>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              disabled={approvingNoData}
              onClick={handleApproveNoData}
              className="btn-info join-item btn"
            >
              {!approvingNoData ? (
                "Approve"
              ) : (
                <div className="flex items-center gap-2">
                  <Loading /> Approving...
                </div>
              )}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};
export default CertificateApprovementDialog;
