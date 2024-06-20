import React, { useEffect } from "react";
import { api } from "~/utils/api";
import Loading from "../Shared/LoadingIndicator";
import { GrDocumentImage } from "react-icons/gr";
import Link from "next/link";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useRouter } from "next/router";

const CertificationApproveTable = () => {
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
    mutate: unapprove,
    isLoading: unapproving,
    isError: unapproveError,
    isSuccess: unapproved,
  } = api.certification.unapprove.useMutation();

  const handleUnApprovment = (microchip: string) => {
    // approve({ approverPosition, approverWallet, microchip });
    unapprove({ microchip });
  };

  useEffect(() => {
    if (unapproved) {
      void replace({
        pathname: "/success",
        query: {
          title: "Removed!",
          content: "ลบข้อมูลเรียบร้อยแล้ว",
          backPath: "/admin/dashboard",
        },
      });
    }
  }, [unapproved, unapproving, unapproveError]);

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
                <td>{req.microchip}</td>
                <td className="hidden md:block">{req.ownerName}</td>
                <td className="flex flex-col gap-2">
                  <Link
                    className="btn-primary btn-sm btn disabled:bg-slate-200"
                    href={`/admin/certificate/preview/${req.microchip}?bornAt=${
                      req.bornAt ?? "N/A"
                    }&no=${req.no}&ownerName=${
                      req.ownerName
                    }&year=${req.updatedAt.getFullYear()}`}
                  >
                    อนุมัติ
                  </Link>
                  <button
                    disabled={unapproving}
                    onClick={() => handleUnApprovment(req.microchip)}
                    className="btn-primary btn-sm btn disabled:bg-slate-200"
                  >
                    {unapproving ? "กำลังยกเลิก.." : "ยกเลิก"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CertificationApproveTable;
