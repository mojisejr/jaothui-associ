import React, { useEffect } from "react";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";
import Loading from "../Shared/LoadingIndicator";
import { AiFillCheckSquare } from "react-icons/ai";
import { toast } from "react-toastify";

const MicrochipTable = () => {
  const { wallet } = useBitkubNext();

  const {
    data: microchips,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = api.microchip.get.useQuery({
    wallet: wallet as string,
  });

  const {
    mutate: activate,
    isLoading: activating,
    isSuccess: activated,
    isError: activatingError,
  } = api.microchip.activate.useMutation();

  const microchipActivate = (microchip: string) => {
    activate({ microchip });
  };

  console.log(microchips);

  useEffect(() => {
    if (activated) {
      toast.success("Activated Successful");
      void refetch();
    }

    if (activatingError) {
      toast.error("Activating Error!");
    }
  }, [activated, activatingError]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Installed</th>
          <th>Buffalo{"'"} name</th>
          <th>Microchip No</th>
          <th>Payment Status</th>
          <th>Shipping Status</th>
          <th>Pedigree Minting Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <>
        {isLoading ? (
          <tbody>
            <Loading />
          </tbody>
        ) : (
          <tbody>
            <>
              {microchips != undefined && microchips.length <= 0 ? (
                <div>No data</div>
              ) : (
                microchips?.map((microchip) => (
                  <tr key={microchip.id}>
                    <td>
                      <>
                        {microchip.microchip?.active ? (
                          <AiFillCheckSquare size={24} className="text-info" />
                        ) : (
                          <AiFillCheckSquare
                            size={24}
                            className="text-gray-200"
                          />
                        )}
                      </>
                    </td>
                    <td>{microchip.buffaloName}</td>
                    <td>{microchip.microchip?.microchip}</td>
                    <td>
                      <>
                        {microchip.approved ? (
                          <div className="badge badge-success text-white">
                            Approved
                          </div>
                        ) : (
                          <div className="badge badge-info">Pending</div>
                        )}
                      </>
                    </td>
                    <td>
                      <>
                        {microchip.shipped ? (
                          <div className="badge badge-success text-white">
                            Shipped
                          </div>
                        ) : (
                          <div className="badge badge-info">Pending</div>
                        )}
                      </>
                    </td>
                    <td>
                      <>
                        {microchip.minted ? (
                          <div className="badge badge-success text-white">
                            Minted
                          </div>
                        ) : (
                          <div className="badge badge-info">Pending</div>
                        )}
                      </>
                    </td>
                    <td>
                      <button
                        disabled={
                          activating ||
                          microchip.microchip?.active ||
                          !microchip.approved ||
                          !microchip.shipped
                        }
                        onClick={() =>
                          microchipActivate(microchip.microchip!.microchip)
                        }
                        className="btn-primary btn-xs btn"
                      >
                        {activating ? <Loading /> : "Installed"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </>
          </tbody>
        )}
      </>
    </table>
  );
};

export default MicrochipTable;
