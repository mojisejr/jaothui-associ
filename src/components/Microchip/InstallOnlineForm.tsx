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
import {
  getProvinces,
  getAmphoeFromProvince,
  getDistrictsFromAmphoe,
} from "~/utils/addressHelper";

interface InputTypes {
  name: string;
  color: string;
  sex: string;
  birthday: string;
  origin?: string;
  height?: number;
  buffaloImage: FileList;
  paymentSlip: FileList;
  tel: string;
  address: string;
  email?: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
}

const BuyMicrochipOnline = () => {
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
  } = api.microchip.buyOnline.useMutation();

  const { register, handleSubmit, reset, watch } = useForm<InputTypes>();

  const [{ province, amphoe }, setAddress] = useState<{
    province?: string;
    amphoe?: string;
    district?: string;
  }>({
    province: undefined,
    amphoe: undefined,
    district: undefined,
  });

  useEffect(() => {
    const subscription = watch(({ province, amphoe, district }) => {
      setAddress({ province, amphoe, district });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      shippingAddress: `${user?.name} ${data.address} ${data.district} ${data.amphoe} ${data.province} ${data.zipcode} ${data.tel}`,
      slipUrl: result.path,
      buffaloName: data.name,
      buffaloBirthday: new Date(data.birthday).getTime().toString(),
      buffaloColor: data.color,
      buffaloOrigin: data.origin ?? "thai",
      buffaloSex: data.sex,
      buffaloHeight: +data.height!,
      buffaloIpfsUrl: ipfs,
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
                accept="image/png, image/jpeg, image/jpg"
                required
                {...register("buffaloImage", { required: true })}
              ></input>
              <label className="label">
                <span className="label-text-alt text-red-500">*required</span>
              </label>
            </div>

            {/** Address Selecor form */}
            <div className="input-group-md">
              <div className="form-control w-full max-w-xs p-2">
                <label className="label">
                  <span className="label-text">บ้านเลขที่</span>
                </label>
                <input
                  type="text"
                  disabled={buying || loading}
                  {...register("address", { required: true })}
                  className="input-bordered input w-full max-w-xs"
                />
                <label className="label">
                  <span className="label-text-alt text-red-500">*required</span>
                </label>
              </div>
              <div className="form-control w-full max-w-xs p-2">
                <label className="label">
                  <span className="label-text">จังหวัด</span>
                </label>
                <select
                  className="select-bordered select"
                  required
                  disabled={buying || loading}
                  {...register("province", { required: true })}
                >
                  <option disabled selected>
                    เลือก
                  </option>
                  {getProvinces().map((p, index) => (
                    <option key={index} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <label className="label">
                  <span className="label-text-alt text-red-500">*required</span>
                </label>
              </div>
              <div className="form-control w-full max-w-xs p-2">
                <label className="label">
                  <span className="label-text">อำเภอ</span>
                </label>
                <select
                  className="select-bordered select"
                  required
                  disabled={buying || loading}
                  {...register("amphoe", { required: true })}
                >
                  <option disabled selected>
                    เลือก
                  </option>
                  {getAmphoeFromProvince(province!).map((p, index) => (
                    <option key={index} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <label className="label">
                  <span className="label-text-alt text-red-500">*required</span>
                </label>
              </div>
              <div className="form-control w-full max-w-xs p-2">
                <label className="label">
                  <span className="label-text">ตำบล</span>
                </label>
                <select
                  className="select-bordered select"
                  required
                  disabled={buying || loading}
                  {...register("district", { required: true })}
                >
                  <option disabled selected>
                    เลือก
                  </option>
                  {getDistrictsFromAmphoe(province!, amphoe!).map(
                    (p, index) => (
                      <option key={index} value={p}>
                        {p}
                      </option>
                    )
                  )}
                </select>
                <label className="label">
                  <span className="label-text-alt text-red-500">*required</span>
                </label>
              </div>
              <div className="form-control w-full max-w-xs p-2">
                <label className="label">
                  <span className="label-text">รหัสไปรษณีย์</span>
                </label>
                <input
                  type="number"
                  required
                  {...register("zipcode", { required: true })}
                  className="input-bordered input w-full max-w-xs"
                />
              </div>
              <div className="form-control w-full max-w-xs p-2">
                <label className="label">
                  <span className="label-text">โทร.</span>
                </label>
                <input
                  type="string"
                  required
                  {...register("tel", { required: true })}
                  className="input-bordered input w-full max-w-xs"
                />
              </div>
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

export default BuyMicrochipOnline;
