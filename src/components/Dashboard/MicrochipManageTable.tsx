/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import Loading from "../Shared/LoadingIndicator";
import { api } from "~/utils/api";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { toast } from "react-toastify";

import { SubmitHandler, useForm } from "react-hook-form";
import csvtojson from "csvtojson";

interface MicrochipAddingTypes {
  file: FileList;
}

const MicrochipManageTable = () => {
  const { wallet, tokens } = useBitkubNext();

  const {
    data: inventory,
    isLoading: inventoryLoading,
    refetch: refetchInventory,
  } = api.microchip.getAll.useQuery();

  const {
    mutate: addMicrochips,
    isLoading: addMicrochipLoading,
    isSuccess: addedMicrochip,
    isError: addMicrochipError,
  } = api.admin.addMicrochips.useMutation();

  const {
    mutate: approveMicrochipPayment,
    isLoading: microchipApproving,
    isSuccess: microchipApproved,
    isError: microchipApprovalError,
  } = api.admin.approveMicrochipPayment.useMutation();

  const {
    mutate: approveShipping,
    isLoading: shippingApproving,
    isSuccess: shippingApproved,
    isError: shippingApprovalError,
  } = api.admin.confirmShipping.useMutation();

  const {
    data: orders,
    isLoading: microchipsLoading,
    isSuccess: microchipsLoaded,
    isError: microchipsLoadingError,
    refetch: refetchMicrochips,
  } = api.admin.getNotCompleteMicrochip.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  const handleApproveMicrochipPayment = (orderId: number) => {
    approveMicrochipPayment({
      wallet: wallet as string,
      accessToken: tokens?.access_token as string,
      orderId,
    });
  };

  const handleApproveShipping = (orderId: number) => {
    approveShipping({
      wallet: wallet as string,
      accessToken: tokens?.access_token as string,
      orderId,
    });
  };

  const { register, handleSubmit, reset } = useForm<MicrochipAddingTypes>();

  const onSubmit: SubmitHandler<MicrochipAddingTypes> = (data, event) => {
    event?.preventDefault();

    //read file from input
    const fr = new FileReader();
    fr.onload = async () => {
      const microchips = (await csvtojson().fromString(
        fr.result as string
      )) as {
        microchip: string;
      }[];

      if (Object.keys(microchips[0]!)[0] != "microchip") {
        toast.error("invalid microchip data file, please check");
        reset();
        return;
      } else {
        //parse from array of [{microchip: string}] => [string]
        const microchipIds = microchips.map((m) => m.microchip);
        addMicrochips({
          wallet: wallet as string,
          accessToken: tokens?.access_token as string,
          microchipIds,
        });
        return;
      }
    };
    fr.readAsText(data.file[0]!);
  };

  useEffect(() => {
    if (microchipApproved) {
      toast.success("microchip payment complete!");
    }

    if (microchipApprovalError) {
      toast.error("microchip payment approval failed");
    }

    if (shippingApproved) {
      toast.success("microchip shipped complete!");
    }

    if (shippingApprovalError) {
      toast.error("microchip shipping marking failed");
    }

    if (addedMicrochip) {
      toast.success("microchips inventory updated!");
      reset();
    }

    if (addMicrochipError) {
      toast.error("error cannot upload microchips to inventory");
      reset();
    }

    void refetchMicrochips();
    void refetchInventory();
  }, [
    microchipApproved,
    microchipApprovalError,
    shippingApproved,
    shippingApprovalError,
    addedMicrochip,
    addMicrochipError,
  ]);

  return (
    <>
      <form
        className="flex items-center gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="join">
          <div className="form-control join-item">
            <input
              disabled={addMicrochipLoading}
              type="file"
              className="file-input file-input-xs join-item"
              accept=".csv"
              {...register("file", { required: true })}
            ></input>
          </div>
          <div className="indicator">
            <span className="badge badge-error indicator-item rounded-full">
              {inventoryLoading ? (
                <Loading />
              ) : (
                <div>{inventory == undefined ? 0 : inventory.count}</div>
              )}
            </span>
            <button
              disabled={addMicrochipLoading}
              type="submit"
              className="btn-primary btn-xs join-item btn"
            >
              {addMicrochipLoading ? <Loading /> : "add microchip"}
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>slip</th>
            <th>microchip</th>
            <th>shipping address</th>
            <th>paid</th>
            <th>shipped</th>
            <th>installed</th>
            <th>minted</th>
          </tr>
        </thead>
        <tbody>
          <>
            {microchipsLoading ? (
              <Loading />
            ) : (
              <>
                {orders == undefined ? (
                  <div>no data</div>
                ) : (
                  orders.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <Link href={m.slipUrl ?? "#"} target="_blank">
                          <FiExternalLink size={20} className="text-info" />
                        </Link>
                      </td>
                      <td>{m.microchip?.microchip}</td>
                      <td className="flex max-w-[200px] flex-wrap">
                        {m.shippingAddress}
                      </td>
                      <td>
                        <>
                          {m.approved ? (
                            <div className="badge badge-success text-white">
                              Paid
                            </div>
                          ) : (
                            <button
                              disabled={microchipApproving || shippingApproving}
                              onClick={() =>
                                handleApproveMicrochipPayment(m.id)
                              }
                              className="btn-primary btn-xs btn"
                            >
                              {microchipApproving ? <Loading /> : "Mark"}
                            </button>
                          )}
                        </>
                      </td>
                      <td>
                        <>
                          {m.shipped ? (
                            <div className="badge badge-success text-white">
                              Shipped
                            </div>
                          ) : (
                            <button
                              disabled={microchipApproving || shippingApproving}
                              onClick={() => handleApproveShipping(m.id)}
                              className="btn-primary btn-xs btn"
                            >
                              {shippingApproving ? <Loading /> : "Mark"}
                            </button>
                          )}
                        </>
                      </td>
                      <td>
                        <>
                          {m.microchip?.active ? (
                            <div className="badge badge-success text-white">
                              installed
                            </div>
                          ) : (
                            <div className="badge badge-info text-white">
                              pending
                            </div>
                          )}
                        </>
                      </td>
                      <td>
                        <>
                          {m.minted ? (
                            <div className="badge badge-success text-white">
                              minted
                            </div>
                          ) : (
                            <div className="badge badge-info text-white">
                              pending
                            </div>
                          )}
                        </>
                      </td>
                    </tr>
                  ))
                )}
              </>
            )}
          </>
        </tbody>
      </table>
    </>
  );
};

export default MicrochipManageTable;
