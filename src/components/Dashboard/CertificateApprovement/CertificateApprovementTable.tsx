import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loading from "~/components/Shared/LoadingIndicator";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { MappedMetadata } from "~/interfaces/Metadata";
import { api } from "~/utils/api";
import { SubmitHandler, useForm } from "react-hook-form";
import CertificateApprovementDialog from "./CertificateApprovementDialog";

type ApproveType = {
  bornAt: string;
  owner: string;
};

const CertificateApprovementTable = () => {
  const [currentMicrochip, setCurrentMicrochip] = useState<string>();
  const [hasApproveData, setHasApprovementData] = useState<boolean>(false);
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

  const { isSuccess: approved } = api.certification.approve.useMutation();

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
      if (!byMicrochip) {
        setCurrentData([]);
        return;
      }

      setCurrentData([byMicrochip]);
    } else {
      const byName = metadata?.find((m) => m.name.includes(value as string));
      if (!byName) {
        setCurrentData([]);
        return;
      }
      setCurrentData([byName]);
    }
  }

  function handleApprovement(microchip: string, hasApprovementData: boolean) {
    setCurrentMicrochip(microchip);
    setHasApprovementData(hasApprovementData);
    window.certificate_approve_dialog.showModal();
  }

  useEffect(() => {
    if (approved) {
      void refetch();
      setCurrentData(metadata!);
    }
  }, [currentData, setCurrentData, metadata, approved]);

  useEffect(() => {
    setCurrentData(metadata!);
  }, [metadata]);

  return (
    <div>
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
      {isApprover ? (
        <div className="max-h-[400px] overflow-auto">
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
                currentData?.map((m, index) => (
                  <tr key={index}>
                    <td>{m.microchip}</td>
                    <td>{m.name}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleApprovement(m.microchip, m.hasApprovementData)
                        }
                        className="disabled:bg-tranparent btn-primary btn-xs btn"
                      >
                        Approve
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
      <CertificateApprovementDialog
        microchip={currentMicrochip!}
        hasApproveData={hasApproveData}
      />
    </div>
  );
};

export default CertificateApprovementTable;
