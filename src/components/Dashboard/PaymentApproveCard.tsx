import Link from "next/link";
import { useEffect } from "react";
import { GrDocumentImage } from "react-icons/gr";
import { toast } from "react-toastify";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";
import { getDaysPassed } from "~/utils/getDaysPassed";

interface PaymentApproveProps {
  slipUrl?: string;
  name?: string;
  wallet?: string;
  payment?: boolean;
  start?: Date;
}

function PaymentApproveCard({
  slipUrl,
  name,
  wallet,
  payment,
  start,
}: PaymentApproveProps) {
  const { tokens, wallet: bitkubWallet, isConnected } = useBitkubNext();
  const {
    mutate: approve,
    isLoading,
    isSuccess,
    isError,
  } = api.admin.approveUserPayment.useMutation();

  useEffect(() => {
    if (isSuccess) toast.success(`Approve for user ${name as string} success!`);
    if (isError) toast.error(`Approve for user ${name as string} failed`);

    void fetchwaitForPaymentUsers();
  }, [isLoading, isSuccess, isError]);

  const { refetch: fetchwaitForPaymentUsers } =
    api.admin.getWaitForPaymentApproval.useQuery({
      accessToken: tokens?.access_token as string,
      wallet: bitkubWallet as string,
    });

  function handleApprovment() {
    if (!isLoading) {
      approve({
        accessToken: tokens?.access_token as string,
        wallet: bitkubWallet as string,
        target: wallet as string,
      });
    }
  }

  return (
    <li className="flex w-full  items-center justify-between gap-2 rounded-xl bg-gray-100 px-2 py-3 shadow-md hover:bg-green-50">
      <Link
        className="flex flex-col items-center justify-center rounded-xl border-r-[1px] bg-green-300 p-2"
        target="_blank"
        href={!slipUrl ? "/" : slipUrl}
      >
        <GrDocumentImage size={20} />
        <span>slip</span>
      </Link>
      <div>
        <div>
          <h1 className="font-bold">{!name ? "N/A" : name}</h1>
          <h3 className="font-bold text-gray-600">{`${
            wallet?.slice(0, 6) as string
          }...${wallet?.slice(38) as string}`}</h3>
        </div>
        <p className="rounded-lg bg-gray-200 px-2 py-1 text-center font-bold">
          {!payment ? "รายปี 100 บาท" : "ตลอดชีพ 600 บาท"}
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => handleApprovment()}
          className="rounded-lg bg-gray-200 px-2 py-1 hover:bg-green-400 disabled:text-gray-50 disabled:hover:bg-slate-500"
          disabled={isLoading}
        >
          {isLoading ? "โปรดรอ" : "อนุมัติ"}
        </button>
        <p className="text-[0.7rem] text-gray-500">{getDaysPassed(start!)}</p>
      </div>
    </li>
  );
}

export default PaymentApproveCard;
