import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import LoadingDialog from "../Shared/LoadingModal";
import Loading from "../Shared/LoadingIndicator";
import { GrDocumentImage } from "react-icons/gr";
import Link from "next/link";
import CertificationDetailDialog from "./CertificationDetailDialog";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useRouter } from "next/router";

const CertificationApproveTable = () => {
  const [ready, setReady] = useState<boolean>(false);
  const { wallet, tokens } = useBitkubNext();
  const { replace } = useRouter();

  const { data: approver, isLoading: approverLoading } =
    api.certification.isApprover.useQuery({
      wallet: wallet!,
    });

  const { data: requests, isLoading } =
    api.certification.getWaitForApprove.useQuery({
      approver: approver != undefined ? approver.wallet : "",
      approverPosition: approver != undefined ? approver.position : -1,
    });

  const {
    mutate: approve,
    isLoading: approving,
    isError: approveError,
    isSuccess: approved,
  } = api.certification.approve.useMutation();

  const handleApprovement = (
    approverWallet: string,
    approverPosition: number,
    microchip: string
  ) => {
    approve({ approverPosition, approverWallet, microchip });
  };

  useEffect(() => {
    if (approved) {
      void replace({
        pathname: "/success",
        query: {
          title: "Approved!",
          content: "อนุมัติเรียบร้อย",
          backPath: "/admin/dashboard",
        },
      });
    }

    if (approving) {
      window.loading_dialog.showModal();
    }

    if (approveError) {
      window.loading_dialog.close();
    }
  }, [approved, approving, approveError]);

  if (approver == undefined || window == undefined)
    return <div className="p-2">เฉพาะผู้มีสิทธิ์อนุมัติ</div>;

  return (
    <>
      {isLoading || requests == undefined ? (
        <Loading />
      ) : (
        <table className="table">
          <thead>
            <th>slip</th>
            <th>microchip</th>
            <th className="hidden md:block">เจ้าของ</th>
            <th>อนุมัติ</th>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.microchip} className="hover:bg-slate-200">
                <td>
                  <Link target="_blank" href={!req.slipUrl ? "/" : req.slipUrl}>
                    <GrDocumentImage size={20} />
                    <span>slip</span>
                  </Link>
                </td>
                <td
                // onClick={() => window.certificate_approve_dialog.showModal()}
                >
                  {req.microchip}
                </td>
                <td className="hidden md:block">{req.ownerName}</td>
                <td>
                  <button
                    disabled={approving}
                    onClick={() =>
                      handleApprovement(
                        approver.wallet,
                        approver.position,
                        req.microchip
                      )
                    }
                    className="btn-primary btn-sm disabled:bg-slate-200"
                  >
                    {approving ? "กำลังอนุมัติ.." : "อนุมัติ"}
                  </button>
                </td>
                {/* <CertificationDetailDialog request={req} approver={approver} /> */}
                <LoadingDialog message="กำลังอนุมัติ" />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CertificationApproveTable;
