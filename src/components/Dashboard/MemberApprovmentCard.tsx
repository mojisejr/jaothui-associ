import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useEffect } from "react";
import { api } from "../../utils/api";
import { toast } from "react-toastify";

interface MemberApprovementProps {
  name?: string;
  wallet?: string;
  dayPassed?: number;
}

function MemberApprovementCard({
  name,
  wallet,
  dayPassed,
}: MemberApprovementProps) {
  const { tokens, wallet: bitkubWallet, isConnected } = useBitkubNext();

  const { refetch: fetchWaitForActive } =
    api.admin.getWaitForApprovement.useQuery({
      accessToken: tokens?.access_token as string,
      wallet: bitkubWallet as string,
    });

  const {
    mutate: approve,
    isLoading: isApproving,
    isSuccess: isApproved,
    isError: isApprovingError,
  } = api.admin.approveUser.useMutation();

  const {
    mutate: reject,
    isLoading: isRejecting,
    isSuccess: isRejected,
    isError: isRejectionError,
  } = api.admin.rejectUser.useMutation();

  useEffect(() => {
    if (isApproved)
      toast.success(`Approve for user ${name as string} success!`);
    if (isApprovingError)
      toast.error(`Approve for user ${name as string} failed`);
    if (isRejected)
      toast.success(`Rejecting for user ${name as string} success!`);
    if (isRejectionError)
      toast.error(`Rejecting for user ${name as string} failed`);
    void fetchWaitForActive();
  }, [isApproved, isRejected, isApprovingError, isRejectionError]);

  function handleApprovment() {
    if (!isApproving) {
      approve({
        accessToken: tokens?.access_token as string,
        wallet: bitkubWallet as string,
        target: wallet as string,
      });
    }
  }

  function handleRejection() {
    if (!isRejecting) {
      reject({
        accessToken: tokens?.access_token as string,
        wallet: bitkubWallet as string,
        target: wallet as string,
      });
    }
  }
  return (
    <li className="flex w-full  items-center justify-between gap-2 rounded-xl bg-gray-100 px-2 py-3 shadow-md hover:bg-green-50">
      <div className="flex items-center justify-center rounded-xl border-r-[1px] bg-green-300 p-2">
        <p className="text-xl font-bold">{!dayPassed ? 0 : dayPassed}/15</p>
      </div>
      <div>
        <div>
          <h1 className="font-bold">{!name ? "N/A" : name}</h1>
          <h3 className="font-bold text-gray-600">{`${
            wallet?.slice(0, 6) as string
          }...${wallet?.slice(38) as string}`}</h3>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <button
          disabled={isRejecting || isApproving || dayPassed! < 15}
          onClick={handleApprovment}
          className="rounded-lg bg-gray-200 px-2 py-1 hover:bg-green-400 disabled:text-gray-50 disabled:hover:bg-gray-200"
        >
          {isApproving ? "โปรดรอ" : "อนุมัติ"}
        </button>
        <button
          onClick={handleRejection}
          disabled={isRejecting || isApproving || dayPassed! < 15}
          className="rounded-lg bg-gray-200 px-2 py-1 hover:bg-red-400 hover:text-white disabled:text-gray-50 disabled:hover:bg-gray-200"
        >
          {isApproving ? "โปรดรอ" : "ไม่อนุมัติ"}
        </button>
      </div>
    </li>
  );
}

export default MemberApprovementCard;
