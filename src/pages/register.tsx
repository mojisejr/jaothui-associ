/* eslint-disable @typescript-eslint/no-misused-promises */
import Footer from "~/components/Information/Footer";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "../utils/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "~/server/supabase";
import { useRouter } from "next/router";
import {
  getProvinces,
  getAmphoeFromProvince,
  getDistrictsFromAmphoe,
} from "~/utils/addressHelper";
import RegisterResultDialog from "~/components/Register/RegisterResultDialog";
import Loading from "~/components/Shared/LoadingIndicator";
import { Layout } from "~/components/Shared/Layout";

type Inputs = {
  name: string;
  tel: string;
  address: string;
  email?: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
  wallet: string;
  payment: "1" | "2";
  file: FileList;
};

const Register = () => {
  const [{ province, amphoe }, setAddress] = useState<{
    province?: string;
    amphoe?: string;
    district?: string;
  }>({
    province: undefined,
    amphoe: undefined,
    district: undefined,
  });

  const { isConnected, wallet, tokens } = useBitkubNext();
  const {
    isLoading: registering,
    isSuccess: registered,
    isError: registerError,
    mutate: createNewMember,
  } = api.register.register.useMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const { replace } = useRouter();

  useEffect(() => {
    const subscription = watch(({ province, amphoe, district }) => {
      setAddress({ province, amphoe, district });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (registerError || registered) {
      if (registerError) {
        toast.error("Error: Registration failed, please try again");
        window.register_result_dialog.hasAttribute("Open")
          ? null
          : window.register_result_dialog.showModal();
      }
      if (registered) {
        toast.success("Success: Registration successfully");
        window.register_result_dialog.hasAttribute("Open")
          ? null
          : window.register_result_dialog.showModal();
      }
      reset();
    }
  }, [registerError, registered]);

  useEffect(() => {
    if (!isConnected) {
      void replace("/");
    }
  }, [isConnected]);

  // useEffect(() => {
  //   void replace("/");
  // }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    event?.preventDefault();
    const extension = data.file[0]?.name.split(".")[1];
    const { data: result, error } = await supabase.storage
      .from("slipstorage")
      .upload(
        `${new Date().getTime()}_${data.wallet}.${extension as string}
        `,
        data.file[0]!,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (error) {
      toast.error("File uploading failed!, try again!");
      return;
    } else {
      createNewMember({
        accessToken: tokens?.access_token as string,
        ...data,
        email: data.email as string,
        address: `${data.address} ${data.district} ${data.amphoe} ${data.province} ${data.zipcode}`,
        slipUrl: result.path,
      });
    }
  };

  return (
    <>
      <Layout>
        <RegisterResultDialog success={registered} />
        <div className="flex max-h-full min-h-[600px] justify-center bg-[url('/images/bgmain.jpg')] bg-cover text-white">
          {isConnected ? (
            <>
              <div className="flex flex-col items-center w768:mt-[80px] w1440:mt-[150px]">
                <div
                  style={{ fontFamily: "Kanit" }}
                  className="mb-2 text-[2rem] w768:text-[3rem]"
                >
                  สมัครสมาชิก
                </div>
                <div
                  className={`w-full ${
                    registering ? "bg-[#eee]" : "bg-white"
                  } text-black`}
                >
                  <form
                    className="flex flex-col gap-3 p-10 shadow-lg"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">ชื่อ - นามสกุล</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={registering}
                        {...register("name", { required: true })}
                        className="input-bordered input w-full max-w-xs"
                      />
                      <label className="label">
                        <span className="label-text-alt text-red-500">
                          *required
                        </span>
                      </label>
                    </div>
                    <div className="form-control w-full max-w-xs p-2">
                      <label className="label">
                        <span className="label-text">เบอร์โทรศัพท์</span>
                      </label>
                      <input
                        type="text"
                        disabled={registering}
                        required
                        {...register("tel", { required: true })}
                        className="input-bordered input w-full max-w-xs"
                      />
                      <label className="label">
                        <span className="label-text-alt text-red-500">
                          *required
                        </span>
                      </label>
                    </div>
                    <div className="form-control w-full max-w-xs p-2">
                      <label className="label">
                        <span className="label-text">อีเมล(ถ้ามี)</span>
                      </label>
                      <input
                        type="email"
                        disabled={registering}
                        {...register("email", { required: false })}
                        className="input-bordered input w-full max-w-xs"
                      />
                    </div>
                    <div className="form-control w-full max-w-xs p-2">
                      <label className="label">
                        <span className="label-text">บ้านเลขที่</span>
                      </label>
                      <input
                        type="text"
                        disabled={registering}
                        {...register("address", { required: true })}
                        className="input-bordered input w-full max-w-xs"
                      />
                      <label className="label">
                        <span className="label-text-alt text-red-500">
                          *required
                        </span>
                      </label>
                    </div>
                    <div className="form-control w-full max-w-xs p-2">
                      <label className="label">
                        <span className="label-text">จังหวัด</span>
                      </label>
                      <select
                        className="select-bordered select"
                        required
                        disabled={registering}
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
                        <span className="label-text-alt text-red-500">
                          *required
                        </span>
                      </label>
                    </div>
                    <div className="form-control w-full max-w-xs p-2">
                      <label className="label">
                        <span className="label-text">อำเภอ</span>
                      </label>
                      <select
                        className="select-bordered select"
                        required
                        disabled={registering}
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
                        <span className="label-text-alt text-red-500">
                          *required
                        </span>
                      </label>
                    </div>
                    <div className="form-control w-full max-w-xs p-2">
                      <label className="label">
                        <span className="label-text">ตำบล</span>
                      </label>
                      <select
                        className="select-bordered select"
                        required
                        disabled={registering}
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
                        <span className="label-text-alt text-red-500">
                          *required
                        </span>
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
                        <span className="label-text">Bitkub Next</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={true}
                        value={wallet}
                        {...register("wallet", { value: wallet })}
                        className="input-bordered input w-full max-w-xs"
                      />
                    </div>
                    <div className="form-control w-full max-w-xs p-2">
                      <label className="label">
                        <span className="label-text">ตัวเลือกสมาชิก</span>
                      </label>
                      <select
                        className="select-bordered select"
                        required
                        disabled={registering}
                        {...register("payment", { required: true })}
                      >
                        <option disabled selected>
                          เลือก
                        </option>
                        <option value="1">รายปี 100 บาท</option>
                        <option value="2">ตลอดชีพ 600 บาท</option>
                      </select>
                      <label className="label">
                        <span className="label-text-alt text-red-500">
                          *required
                        </span>
                      </label>
                    </div>
                    <div>
                      <div>หมายเลขบัญชีสมาคม</div>
                      <div className="bg-slate-200 p-2">
                        <div>ธนาคารกรุงศรีอยุธยา</div>
                        <div>
                          เลขที่บัญชี{" "}
                          <span className="font-bold">438-1-26937-1</span>
                        </div>
                        <div>ชื่อบัญชี สมาคมอนุรักษ์และพัฒนาควายไทย</div>
                      </div>
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">แนบสลิป</span>
                      </label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        disabled={registering}
                        required
                        {...register("file", { required: true })}
                        className="file-input-bordered file-input w-full max-w-xs"
                      />
                      <label className="label">
                        <span className="label-text-alt text-red-500">
                          *required
                        </span>
                      </label>
                    </div>
                    <button className="btn" type="submit">
                      {registering ? (
                        <div className="flex gap-2">
                          <Loading />
                          <span>กำลังบันทึก..</span>
                        </div>
                      ) : (
                        "แจ้งชำระเงิน"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-screen w-full flex-col items-center justify-center">
              <>
                <Loading />
              </>
            </div>
          )}
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default Register;
