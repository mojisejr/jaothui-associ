/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState, useRef } from "react";
import { Layout } from "~/components/Shared/Layout";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import Loading from "~/components/Shared/LoadingIndicator";
import { storeImageBlob } from "~/server/api/services/ipfs/nftStorage";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { supabase } from "~/server/supabase";

interface InputTypes {
  name: string;
  color: string;
  sex: string;
  birthday: string;
  origin?: string;
  height?: number;
  buffaloImage: FileList;
  paymentSlip: FileList;
  microchipId: string;
}

const BuyMicrochipAndInstallHere = () => {
  const { replace } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { wallet, tokens, isConnected } = useBitkubNext();
  const { data: user, isLoading: loadingUser } = api.user.get.useQuery({
    wallet: wallet as string,
    accessToken: tokens?.access_token as string,
  });

  const {
    mutate: buy,
    error,
    isLoading: buying,
    isSuccess: buyingOK,
    isError: buyingError,
  } = api.microchip.buyAndInstallHere.useMutation();

  const { register, handleSubmit, reset, watch } = useForm<InputTypes>();

  useEffect(() => {
    if (buyingOK) {
      toast.success(`Microchip buying successful`);
      reset();
      void replace({
        pathname: "/success",
        query: {
          title: "Successful",
          content: `Microchip registration successful`,
          backpath: "/microchip",
        },
      });
      setLoading(false);
    }

    if (buyingError) {
      toast.error(`Microchip buying error, ${error.message}`);
      setLoading(false);
    }
  }, [buyingOK, buyingError]);

  useEffect(() => {
    if (!isConnected) {
      void replace("/");
    }
  }, []);

  const onSubmit: SubmitHandler<InputTypes> = async (data, event) => {
    setLoading(true);
    event?.preventDefault();

    //IPFS
    const buffaloBuffer = await data.buffaloImage[0]?.arrayBuffer();
    const ipfs = await storeImageBlob(buffaloBuffer!);

    if (!ipfs) {
      toast.error("Cannot upload image to IPFS, try again");
      setLoading(false);
      return;
    }

    //Shippng Address
    // const [farmId, shippingAddress] = data.farmId.split(",");

    //Slip Url
    const extension = data.paymentSlip[0]?.name.split(".")[1];
    const { data: result, error } = await supabase.storage
      .from("slipstorage/microchip")
      .upload(
        `${new Date().getTime()}_${wallet as string}.${extension as string}
        `,
        data.paymentSlip[0]!,
        {
          cacheControl: "0",
          upsert: false,
        }
      );

    if (error) {
      toast.error("Cannot upload payment slip");
      setLoading(false);
      return;
    }

    const preparedData = {
      wallet: wallet as string,
      slipUrl: result.path,
      buffaloName: data.name,
      buffaloBirthday: new Date(data.birthday).getTime().toString(),
      buffaloColor: data.color,
      buffaloOrigin: data.origin ?? "thai",
      buffaloSex: data.sex,
      buffaloHeight: +data.height!,
      buffaloIpfsUrl: ipfs,
      microchipId: data.microchipId,
    };

    buy(preparedData);
  };

  return (
    <Layout>
      <div className="mt-[120px] h-[80vh] w-full overflow-auto">
        <div className="flex flex-col items-center gap-3">
          <div className="text-xl font-bold">
            Microchip & Buffalo Registration
          </div>
          <form className="max-w-xs py-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label font-bold">Owner Name</label>
              <input
                readOnly={true}
                className="input-bordered input max-w-xs"
                type="text"
                value={user?.name ?? "loading.."}
              ></input>
            </div>

            <div className="form-control">
              <label className="label font-bold">Buffalo{"'"} name</label>
              <input
                disabled={buying || loading}
                className="input-bordered input max-w-xs"
                type="text"
                placeholder="buffalo's name"
                required
                {...register("name", { required: true })}
              ></input>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">Color</label>
              <select
                disabled={buying || loading}
                className="select-bordered select"
                required
                {...register("color", { required: true })}
              >
                <option value="Black">Black</option>
                <option value="Albino">Albino</option>
              </select>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">Gender</label>
              <select
                disabled={buying || loading}
                className="select-bordered select"
                required
                {...register("sex", { required: true })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">Birthday</label>
              <input
                disabled={buying || loading}
                className="input-bordered input max-w-xs"
                type="date"
                required
                {...register("birthday", { required: true })}
              ></input>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label font-bold">Origin</label>
              <input
                disabled={buying || loading}
                className="input-bordered input max-w-xs"
                type="text"
                placeholder="eg. thai"
                {...register("origin")}
              ></input>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label font-bold">Height</label>
              <label className="label-alt-text text-right">cm</label>
              <input
                disabled={buying || loading}
                className="input-bordered input max-w-xs"
                type="text"
                placeholder="167"
                {...register("height", { required: true })}
              ></input>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label font-bold">Buffalo Image</label>
              <label className="label-alt-text text-right text-red-500">
                *only png available
              </label>
              <input
                disabled={buying || loading}
                className="file-input input-bordered max-w-xs"
                type="file"
                accept="image/png"
                required
                {...register("buffaloImage", { required: true })}
              ></input>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label font-bold">Microchip ID</label>
              <label className="label-alt-text text-right text-red-500">
                *installing microchip ID
              </label>
              <input
                disabled={buying || loading}
                className="input-bordered input max-w-xs"
                type="text"
                required
                {...register("microchipId", { required: true })}
              ></input>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>

            <div className="card my-2 rounded-xl bg-primary text-white shadow">
              <div className="card-body">
                <div className="card-title underline">ชำระเงินที่บัญชี</div>
                <p className="font-bold underline">429-160308-9</p>
                <p>บัญชีธนาคารไทยพานิช</p>
                <p>บริษัท เจ้าทุย จำกัด บัญชีเงินฝากออมทรัพย์</p>
              </div>
            </div>

            <div className="form-control">
              <label className="label font-bold">Payment Slip</label>
              <input
                disabled={buying || loading}
                className="file-input input-bordered max-w-xs"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                required
                {...register("paymentSlip", { required: true })}
              ></input>
              <label className="label">
                <span className="label-text-alt text-red-500">
                  *แนบสลิปที่นี่
                </span>
              </label>
            </div>

            <div className="mt-2 flex justify-center gap-2">
              <button
                disabled={buying || loading}
                type="submit"
                className="btn-primary btn"
              >
                {buying || loading ? (
                  <div className="flex items-center gap-2">
                    <Loading /> Processing..
                  </div>
                ) : (
                  <div>Confirm</div>
                )}
              </button>
              <button
                disabled={buying || loading}
                type="reset"
                className="btn-ghost btn"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BuyMicrochipAndInstallHere;
