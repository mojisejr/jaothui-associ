import { useRouter } from "next/router";
import React, { useEffect } from "react";
import CertificateMobile from "~/components/Dashboard/Certificate";
import { Layout } from "~/components/Shared/Layout";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";

const CertificatePreview = () => {
  const { wallet, tokens } = useBitkubNext();
  const { replace, back, query } = useRouter();

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

  const {
    mutate: unapprove,
    isLoading: unapproving,
    isError: unapproveError,
    isSuccess: unapproved,
  } = api.certification.unapprove.useMutation();

  const handleApprovement = (
    approverWallet: string,
    approverPosition: number,
    microchip: string
  ) => {
    approve({ approverPosition, approverWallet, microchip });
  };

  const handleUnApprovment = (microchip: string) => {
    // approve({ approverPosition, approverWallet, microchip });
    unapprove({ microchip });
  };

  // const handlePreview = () => {
  //   if (!window) return;
  //   console.log(window.certificate_approve_dialog);
  //   window.certificate_approve_dialog.showModal();
  // };
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
  }, [approved, approving, approveError]);

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
    <Layout>
      <div className="grid grid-cols-1 place-items-center gap-2">
        <div className="col-span-full w-full p-2">
          <button className="btn" onClick={() => back()}>
            Back
          </button>
        </div>
        <CertificateMobile
          microchip={query?.microchip as string}
          bornAt={query?.bornAt as string}
          no={+(query?.no as string)}
          owner={query?.ownerName as string}
          year={+(query?.year as string)}
        />
      </div>
      <div className="flex justify-center gap-10 py-10">
        <button
          disabled={approving}
          onClick={() =>
            handleApprovement(
              approver.wallet,
              approver.position,
              query?.microchip as string
            )
          }
          className="btn-primary btn-lg disabled:bg-slate-200"
        >
          {approving ? "กำลังอนุมัติ.." : "อนุมัติ"}
        </button>
        <button
          disabled={unapproving}
          onClick={() => handleUnApprovment(query?.microchip as string)}
          className="btn-lg btn bg-red-400 text-white disabled:bg-slate-200"
        >
          {unapproving ? "กำลังยกเลิก.." : "ไม่อนุมัติ"}
        </button>
      </div>
    </Layout>
  );
};

export default CertificatePreview;
