import { useRef, useEffect, type SyntheticEvent } from "react";
import Modal from "../Shared/Modal";
import { toast } from "react-toastify";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import Loading from "../Shared/LoadingIndicator";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const AddFarmModal = () => {
  const farmNameRef = useRef<HTMLInputElement>(null);
  const farmURLRef = useRef<HTMLInputElement>(null);
  const inputFormRef = useRef<HTMLFormElement>(null);
  const farmAddressRef = useRef<HTMLTextAreaElement>(null);
  const farmTelRef = useRef<HTMLInputElement>(null);

  const { replace } = useRouter();
  const { wallet } = useBitkubNext();
  const {
    mutate: addFarm,
    isSuccess: farmAdded,
    isLoading: farmAdding,
    isError: farmAddingError,
  } = api.farm.updateFarmInfo.useMutation();

  useEffect(() => {
    if (farmAdded) {
      toast.success("You avatar updated successfully");
      void replace({
        pathname: "/success",
        query: {
          title: "Success!",
          content: `You added ${
            farmNameRef.current?.value ?? "N/A"
          } successful!`,
          backPath: "/member/farm",
        },
      });
    }

    if (farmAddingError) {
      toast.error("Farm adding failed, try again");
      inputFormRef.current?.reset();
    }
  }, [farmAdded, farmAddingError]);

  const save = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = {
      name: farmNameRef.current?.value as string,
      url: farmURLRef.current?.value as string,
      address: farmAddressRef.current?.value as string,
      tel: farmTelRef.current?.value as string,
    };

    if (!data.name || !data.url || !data.address) {
      toast.error("Invalid data input, try again");
      return;
    }

    const split = data.url.match(/\/@([^/]+)/);
    const latlon = split == null ? [] : split[1]?.split(",");

    if (latlon != undefined && latlon.length > 0) {
      //Cannot parse the LAT LON data
      addFarm({
        name: data.name,
        wallet: wallet as string,
        lat: +latlon[0]!,
        lon: +latlon[1]!,
        url: data.url,
        address: data.address,
        tel: data.tel,
      });
    } else {
      addFarm({
        name: data.name,
        wallet: wallet as string,
        lat: null,
        lon: null,
        url: data.url,
        address: data.address,
        tel: data.tel,
      });
    }
  };

  return (
    <Modal id="edit_farm_dialog">
      <form
        ref={inputFormRef}
        onSubmit={(e) => e.preventDefault()}
        className="grid max-h-[600px] grid-cols-1 gap-3 overflow-auto"
      >
        <div className="form-control px-1">
          <label className="label font-bold">Farm{"'"}s name</label>
          <input
            ref={farmNameRef}
            disabled={farmAdding}
            className="input-bordered input max-w-xs"
            type="text"
            placeholder="Farm's name"
            required
          ></input>
        </div>
        <div className="form-control px-1">
          <label className="label font-bold">location URL</label>
          <input
            ref={farmURLRef}
            disabled={farmAdding}
            className="input-bordered input max-w-xs"
            type="text"
            placeholder="../@12.5529547,102.155561,15z/..."
            required
          ></input>
          <label className="label">
            <span className="label-alt-text">
              ex: https://www.google.com/maps/place/..
              /@12.5529547,102.155561,15z/..
            </span>
          </label>
        </div>
        <div className="form-control px-1">
          <label className="label font-bold">tel.</label>
          <input
            ref={farmTelRef}
            disabled={farmAdding}
            className="input-bordered input max-w-xs"
            type="text"
            placeholder="ex. 092-314-xxxx"
            required
          ></input>
          <label className="label">
            <span className="label-alt-text">ex. 092 123 2345</span>
          </label>
        </div>

        <div className="form-control px-1">
          <label className="label font-bold">address</label>
          <textarea
            ref={farmAddressRef}
            disabled={farmAdding}
            className="textarea-bordered textarea max-w-xs"
            placeholder="ex. 13 หมู่ 16 ต.ควายไทย จ.จังหวัด 21234"
            required
          ></textarea>
          <label className="label">
            <span className="label-alt-text">
              full address [address + postcode]
            </span>
          </label>
        </div>
        <button
          disabled={farmAdding}
          onClick={save}
          className="btn-primary btn"
        >
          {farmAdding ? (
            <div className="flex items-center gap-2">
              <Loading />
              <span>Saving..</span>
            </div>
          ) : (
            <span>Save</span>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddFarmModal;
