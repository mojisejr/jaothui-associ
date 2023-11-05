import React, { useEffect } from "react";
import Link from "next/link";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";
import Loading from "../Shared/LoadingIndicator";
import { MdDeleteForever } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa";
import { toast } from "react-toastify";

const FarmTable = () => {
  const { wallet } = useBitkubNext();
  const {
    data: farms,
    isLoading: farmsLoading,
    refetch,
  } = api.farm.getById.useQuery({
    wallet: wallet as string,
  });
  const {
    mutate: del,
    isSuccess: deleted,
    isError: deleteFailed,
  } = api.farm.deleteFarm.useMutation();

  useEffect(() => {
    if (deleted) {
      toast.success("deleted !");
      void refetch();
    }

    if (deleteFailed) {
      toast.error("cannot delete selected farm");
      return;
    }
  }, [deleted, deleteFailed]);

  const onDelete = (farmId: number) => {
    del({
      farmId,
    });
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Farm{"'"} name</th>
          <th>Farm address</th>
          <th>Action</th>
        </tr>
      </thead>
      {farmsLoading ? (
        <Loading />
      ) : (
        <>
          {farms!.length <= 0 ? (
            <tbody>no farm</tbody>
          ) : (
            <tbody>
              {farms?.map((farm) => (
                <tr key={farm.id} className="hover:underline">
                  <td>{farm.name}</td>
                  <td>{farm.description}</td>
                  <td>
                    <Link
                      href={farm.locationUrl as string}
                      target="_blank"
                      className="btn-ghost btn-xs btn"
                    >
                      <FaLocationArrow className="text-info" />
                    </Link>
                    <button
                      onClick={() => onDelete(farm.id)}
                      className="btn-ghost btn-xs btn"
                    >
                      <MdDeleteForever className="text-error" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </>
      )}
    </table>
  );
};

export default FarmTable;
