import { RefObject, useEffect, useRef, useState } from "react";
import Loading from "../Shared/LoadingIndicator";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  getProvinces,
  getAmphoeFromProvince,
  getDistrictsFromAmphoe,
} from "~/utils/addressHelper";

type Inputs = {
  address: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
};

interface MemberAddressEditProps {
  title: string;
  content: string;
  placeholder: string;
  buttonName: string;
  action: (address: string, province: string, reset: () => void) => void;
  disabled: boolean;
  loading: boolean;
}

export default function MemberAddressEdit({
  title,
  content,
  placeholder,
  buttonName,
  disabled,
  loading,
  action,
}: MemberAddressEditProps) {
  const [{ province, amphoe }, setAddress] = useState<{
    province?: string;
    amphoe?: string;
    district?: string;
  }>({
    province: undefined,
    amphoe: undefined,
    district: undefined,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  useEffect(() => {
    const subscription = watch(({ province, amphoe, district }) => {
      setAddress({ province, amphoe, district });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = handleSubmit((data, event) => {
    event?.preventDefault();
    const address = data.address == undefined ? "" : data.address;
    const zipcode = data.zipcode == undefined ? "" : data.zipcode;
    const inputAddress = `${address} ${data.district} ${data.amphoe} ${data.province} ${zipcode}`;

    action(inputAddress, data.province, reset);
  });

  return (
    <>
      <div className="collapse-arrow join-item collapse border border-base-300">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title">
          <div className="text-md  font-medium text-slate-600">{title}</div>
          <div className="text-slate-500">{content}</div>
        </div>
        <div className="collapse-content flex flex-col">
          <form
            onSubmit={(e) => void onSubmit(e)}
            className="grid grid-cols-1 gap-4"
          >
            <div className="form-control w-full max-w-xs">
              <input
                type="text"
                {...register("address", { required: true })}
                placeholder={"บ้านเลขที่"}
                className="input-bordered  input input-sm w-full max-w-xs rounded-full"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <select
                className="select-bordered  select select-sm rounded-full"
                required
                {...register("province", { required: true })}
              >
                <option disabled selected>
                  จังหวัด
                </option>
                {getProvinces().map((p: string, index: number) => (
                  <option key={index} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-full max-w-xs">
              <select
                className="select-bordered  select select-sm rounded-full"
                required
                {...register("amphoe", { required: true })}
              >
                <option disabled selected>
                  อำเภอ
                </option>
                {getAmphoeFromProvince(province!).map((p, index) => (
                  <option key={index} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-full max-w-xs">
              <select
                className="select-bordered  select select-sm rounded-full"
                required
                {...register("district", { required: true })}
              >
                <option disabled selected>
                  ตำบล
                </option>
                {getDistrictsFromAmphoe(province!, amphoe!).map((p, index) => (
                  <option key={index} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-full max-w-xs">
              <input
                type="number"
                required
                placeholder="รหัสไปรษณีย์"
                {...register("zipcode", { required: true })}
                className="input-bordered  input input-sm w-full max-w-xs rounded-full"
              />
            </div>
            <button
              type="submit"
              className="btn-primary btn-outline btn-sm btn"
            >
              {loading ? <Loading /> : buttonName}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
