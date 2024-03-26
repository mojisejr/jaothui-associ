import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loading from "~/components/Shared/LoadingIndicator";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { MappedMetadata } from "~/interfaces/Metadata";
import { api } from "~/utils/api";

const CertificateApprovementTable = () => {
  const [currentData, setCurrentData] = useState<MappedMetadata[]>([]);
  const { wallet } = useBitkubNext();
  const { data: isApprover } = api.certification.isApprover.useQuery({
    wallet: wallet as string,
  });
  const {
    data: metadata,
    isLoading: loadingMetadata,
    refetch,
  } = api.certification.getAllMetadata.useQuery({
    wallet: wallet as string,
  });
  const {
    mutate: approve,
    isLoading: approving,
    isSuccess: approved,
  } = api.certification.approve.useMutation();

  const searchRef = useRef<HTMLInputElement>(null);

  function handleSearch() {
    const value =
      searchRef.current?.value == undefined ? 0 : searchRef.current.value;

    if (+value <= 0) {
      return;
    }

    const isNumberic = /^\d+$/.test(value.toString()!);

    if (isNumberic) {
      const byMicrochip = metadata?.find((m) => m.microchip == value);
      setCurrentData([byMicrochip!]);
    } else {
      const byName = metadata?.find((m) => m.name.includes(value as string));
      setCurrentData([byName!]);
    }
  }

  function handleApprove(wallet: string, microchip: string) {
    approve({ wallet, microchip });
  }

  useEffect(() => {
    setCurrentData(metadata!);
    if (approved) {
      refetch();
      toast.success("Approved เรียบร้อยแล้ว");
    }
  }, [currentData, setCurrentData, metadata, approved]);

  return (
    <div>
      {isApprover ? (
        <div className="max-h-[400px] overflow-auto">
          <div className="flex p-2">
            <label className="text-label label"></label>
            <input
              onChange={() => {
                if (searchRef.current?.value == "") {
                  setCurrentData(metadata!);
                }
              }}
              ref={searchRef}
              placeholder="microchip or name"
              className="input-bordered input input-xs max-w-[200px]"
              type="text"
            ></input>
            <button
              onClick={() => handleSearch()}
              className="btn-primary btn-xs btn"
            >
              search
            </button>
          </div>
          <table className="table">
            <thead>
              <th>microchip</th>
              <th>name</th>
              <th>action</th>
            </thead>
            <tbody>
              {loadingMetadata ? (
                <Loading />
              ) : (
                currentData?.map((m) => (
                  <tr>
                    <td>{m.microchip}</td>
                    <td>{m.name}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleApprove(wallet as string, m.microchip)
                        }
                        disabled={approving}
                        className="disabled:bg-tranparent btn-primary btn-xs btn"
                      >
                        {approving ? <Loading /> : "approve"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>สำหรับผู้จัดการระบบ certificate เท่านั้น</div>
      )}
    </div>
  );
};

export default CertificateApprovementTable;
