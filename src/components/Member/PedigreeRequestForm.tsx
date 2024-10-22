import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchByMicrochip } from "~/hooks/useSearchByMicrochip";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";
import { Metadata } from "~/interfaces/Metadata";
import { supabase } from "~/server/supabase";
import { toast } from "react-toastify";
import { CreatePedigreeRequest } from "~/interfaces/Pedigree";
import { useRouter } from "next/router";
import { getProvinces } from "~/utils/addressHelper";
import AlertMessageDialog from "../Shared/AlertMessageDialog";
import LoadingDialog from "../Shared/LoadingModal";

type InputType = {
  wallet: string;
  prefix: string;
  ownerName: string;
  bornAt: string;
  file: FileList;
};

const PedigreeRequestForm = () => {
  const { wallet, tokens } = useBitkubNext();
  const { replace } = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [searching, setSerching] = useState<number>(0);
  const [buffaloSearch, setBuffaloSearch] = useState<Metadata>();
  const [mom, setMom] = useState<Metadata>();
  const [dad, setDad] = useState<Metadata>();
  const [mGrandma, setmGrandma] = useState<Metadata>();
  const [mGrandpa, setmGrandpa] = useState<Metadata>();
  const [dGrandma, setdGrandma] = useState<Metadata>();
  const [dGrandpa, setdGrandpa] = useState<Metadata>();

  const { register, handleSubmit } = useForm<InputType>();

  const onSubmit = handleSubmit(async (data, e) => {
    e?.preventDefault();
    window.loading_dialog.showModal();
    const inputData = {
      ...data,
      ownerName:
        data.ownerName == "" ? "-" : `${data.prefix} ${data.ownerName}`,
      wallet: wallet! as string,
      buffaloId: buffaloSearch?.certify.microchip,
      bornAt: data.bornAt == "จังหวัด" ? "-" : data.bornAt,
      momId:
        mom == undefined
          ? undefined
          : `["${mom.certify.microchip}","${mom.name}"]`,
      dadId:
        dad == undefined
          ? undefined
          : `["${dad.certify.microchip}","${dad.name}"]`,
      mGrandmaId:
        mGrandma == undefined
          ? undefined
          : `["${mGrandma.certify.microchip}","${mGrandma.name}"]`,
      mGrandpaId:
        mGrandpa == undefined
          ? undefined
          : `["${mGrandpa.certify.microchip}","${mGrandpa.name}"]`,
      dGrandmaId:
        dGrandma == undefined
          ? undefined
          : `["${dGrandma.certify.microchip}","${dGrandma.name}]"`,
      dGrandpaId:
        dGrandpa == undefined
          ? undefined
          : `["${dGrandpa.certify.microchip}","${dGrandpa.name}]"`,
    };

    const extension = data.file[0]?.name.split(".")[1];
    const { data: result, error } = await supabase.storage
      .from("slipstorage/ped-slip")
      .upload(
        `ped_${new Date().getTime()}_${data.wallet}.${extension as string}
        `,
        data.file[0]!,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (error) {
      toast.error("File uploading failed!, try again!", {
        toastId: "slip-upload",
      });
      window.loading_dialog.close();
    } else {
      save({ ...inputData, slipUrl: result.path } as CreatePedigreeRequest);
    }
  });

  const searchRef = useRef<HTMLInputElement>(null);

  //1
  const momRef = useRef<HTMLInputElement>(null);
  //2
  const dadRef = useRef<HTMLInputElement>(null);
  //3
  const mGrandMaRef = useRef<HTMLInputElement>(null);
  //4
  const mGrandPaRef = useRef<HTMLInputElement>(null);
  //5
  const dGrandMaRef = useRef<HTMLInputElement>(null);
  //6
  const dGrandPaRef = useRef<HTMLInputElement>(null);

  const handleSearch = (type: number, value: string) => {
    setSerching(type);
    if (value == undefined || value == "") return;
    searchByMicrochip(value, type);
  };

  const {
    searchByMicrochip,
    isLoading,
    currentMetadata,
    currentMicrochip,
    isError,
    isSuccess,
  } = useSearchByMicrochip();

  const {
    data: user,
    isLoading: loadingUser,
    isError: loadingUserError,
  } = api.user.get.useQuery({
    wallet: wallet!,
    accessToken: tokens!.access_token!,
  });

  const {
    mutate: save,
    isLoading: saving,
    isSuccess: saved,
    isError: savingError,
  } = api.certification.saveRequestForPed.useMutation();

  useEffect(() => {
    if (isError) {
      switch (searching) {
        case 0: {
          searchRef.current!.value = "";
          setBuffaloSearch(undefined);
          setMessage("ไม่พบข้อมูลควาย");
          return;
        }

        case 1: {
          setMom(undefined);
          momRef.current!.value = "";
          break;
        }
        case 2: {
          setDad(undefined);
          dadRef.current!.value = "";
          break;
        }
        case 3: {
          setmGrandpa(undefined);
          mGrandPaRef.current!.value = "";
          break;
        }
        case 4: {
          setmGrandma(undefined);
          mGrandMaRef.current!.value = "";
          break;
        }
        case 5: {
          setdGrandma(undefined);
          dGrandMaRef.current!.value = "";
          break;
        }
        case 6: {
          setdGrandpa(undefined);
          dGrandPaRef.current!.value = "";
          break;
        }
        default:
          break;
      }
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      if (!currentMetadata) return;
      switch (searching) {
        case 0: {
          setBuffaloSearch(currentMetadata);
          return;
        }

        case 1: {
          if (momRef.current!.value == undefined || momRef.current!.value == "")
            break;
          setMom(currentMetadata);
          momRef.current!.value = currentMetadata.name;
          break;
        }
        case 2: {
          if (dadRef.current!.value == undefined || dadRef.current!.value == "")
            break;
          setDad(currentMetadata);
          dadRef.current!.value = currentMetadata.name;
          break;
        }
        case 3: {
          if (
            mGrandPaRef.current!.value == undefined ||
            mGrandPaRef.current!.value == ""
          )
            break;
          setmGrandpa(currentMetadata);
          mGrandPaRef.current!.value = currentMetadata.name;
          break;
        }
        case 4: {
          if (
            mGrandMaRef.current!.value == undefined ||
            mGrandMaRef.current!.value == ""
          )
            break;
          setmGrandma(currentMetadata);
          mGrandMaRef.current!.value = currentMetadata.name;
          break;
        }
        case 5: {
          if (
            dGrandMaRef.current!.value == undefined ||
            dGrandMaRef.current!.value == ""
          )
            break;
          setdGrandma(currentMetadata);
          dGrandMaRef.current!.value = currentMetadata.name;
          break;
        }
        case 6: {
          if (
            dGrandPaRef.current!.value == undefined ||
            dGrandPaRef.current!.value == ""
          )
            break;
          setdGrandpa(currentMetadata);
          dGrandPaRef.current!.value = currentMetadata.name;
          break;
        }
        default:
          break;
      }
    }
  }, [searching, currentMetadata, isSuccess]);

  useEffect(() => {
    if (saved) {
      void replace({
        pathname: "/success",
        query: {
          title: "Success!",
          content: "Your Request is submitted.",
          backPath: "/member",
        },
      });
    }

    if (savingError) {
      window.loading_dialog.close();
      window.alert_message_dialog.showModal();
    }
  }, [saving, saved, savingError]);

  return (
    <div className="grid grid-cols-1 place-items-center gap-4 p-4">
      <div className="text-center text-xl font-bold md:text-2xl">
        แบบฟอร์มส่งคำร้องขอออกใบพันธุ์ประวัติ
      </div>

      <div className="my-2 flex w-full max-w-xl flex-col gap-2">
        <div className="text-xl font-bold">ค้นหาด้วย microchip</div>
        <div className="form-control flex flex-col gap-2">
          <input
            id="search-input"
            className="input disabled:bg-slate-200"
            ref={searchRef}
            type="text"
            placeholder="microchip"
            disabled={isLoading || saving}
          />
          <button
            disabled={isLoading || saving}
            onClick={() => handleSearch(0, searchRef.current!.value)}
            className="btn-primary btn disabled:bg-slate-200"
          >
            {isLoading ? "กำลังค้นหา..." : "ค้นหา"}
          </button>
        </div>
      </div>

      {buffaloSearch == undefined ? (
        <div>{message}</div>
      ) : (
        <>
          {buffaloSearch != undefined && buffaloSearch.isApproved ? (
            <div>{buffaloSearch?.message}</div>
          ) : (
            <div className="my-2 grid grid-cols-1 gap-4 px-2 md:px-10">
              <div className="text-xl font-bold">ข้อมูลควายที่พบ</div>
              <figure className="flex w-full justify-center">
                <Image
                  src={buffaloSearch?.imageUri}
                  height={1000}
                  width={700}
                  alt={currentMicrochip!}
                />
              </figure>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">microchip</div>
                <div className="font-bold text-yellow-600">
                  {buffaloSearch?.certify.microchip}
                </div>
                <div className="font-bold">ชื่อควาย</div>
                <div className="font-bold text-yellow-600">
                  {buffaloSearch?.name}
                </div>
                <div className="font-bold">รายละเอียด</div>
                <div>
                  <Link
                    href={`https://jaothui.com/cert/${buffaloSearch?.certify.microchip}`}
                    target="_blank"
                    className="flex items-center gap-2 text-yellow-600 underline"
                  >
                    <FaExternalLinkAlt />
                    jaothui.com
                  </Link>
                </div>
              </div>
              {!loadingUser ? (
                <div className="my-2">
                  <div className="text-xl font-bold">แบบฟอร์มเพิ่มข้อมูล</div>
                  <form
                    onSubmit={(e) => {
                      void onSubmit(e);
                    }}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="form-control">
                      <label>bitkub-next</label>
                      <input
                        {...register("wallet", { required: true })}
                        className="input disabled:bg-slate-200"
                        readOnly
                        type="text"
                        value={`${user?.wallet.slice(0, 6) as string}...${
                          user?.wallet.slice(38) as string
                        }`}
                      ></input>
                    </div>
                    <div className="form-control">
                      <label>ชื่อเจ้าของ</label>
                      <div className="flex items-center gap-2">
                        <select
                          {...register("prefix")}
                          className="select-bordered  select  disabled:bg-slate-200"
                        >
                          <option value="นาย">นาย</option>
                          <option value="นาง">นาง</option>
                          <option value="นางสาว">นางสาว</option>
                        </select>
                        <input
                          {...register("ownerName")}
                          placeholder="ชื่อ นามสกุล"
                          className="input w-full disabled:bg-slate-200"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <div>สถานที่เกิด</div>
                      <select
                        className="select-bordered  select  disabled:bg-slate-200"
                        required
                        disabled={saving}
                        {...register("bornAt", { required: true })}
                      >
                        <option disabled selected>
                          จังหวัด
                        </option>
                        {getProvinces().map((p, index) => (
                          <option key={index} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {/* <label>สถานที่เกิด</label>
                  <input
                    disabled={saving}
                    {...register("bornAt", { required: true })}
                    className="input disabled:bg-slate-200"
                    type="text"
                  ></input> */}
                    </div>
                    <div className="border-2 bg-slate-100 p-2">
                      ข้อมูลพันธุ์ประวัติของควายที่ขอใบพันธุ์ประวัติดิจิตอล
                      จะต้องมีข้อมูลใบพันธุ์ประวัติอยู่ในระบบของ Jaothui
                      วิธ๊การค้นหาคือ กรอก microchip
                      ของควายที่เป็นพันธุ์ประวัติแต่ละตำแหน่ง แล้วคลิกปุ่มค้นหา
                      ถ้ามีข้อมูล จะปรากฎชื่อของควายแทนที่ข้อมูล microchip
                      เพื่อให้ตรวจสอบว่าตรงกันกับข้อมูลควายที่ต้องการ
                    </div>
                    <div className="form-control ">
                      <label>พ่อ</label>
                      <div className="flex">
                        <div className="w-full">
                          <input
                            disabled={saving}
                            ref={dadRef}
                            placeholder="microchip (ถ้ามี)"
                            className="input w-full disabled:bg-slate-200"
                            type="text"
                          ></input>
                          <div>
                            {searching == 2 && dadRef.current!.value == ""
                              ? "ไม่พบข้อมูล"
                              : null}
                          </div>
                        </div>

                        <button
                          disabled={saving}
                          onClick={() => handleSearch(2, dadRef.current!.value)}
                          className="btn-primary btn disabled:bg-slate-200"
                          type="button"
                        >
                          ค้นหา
                        </button>
                      </div>
                    </div>
                    <div className="form-control">
                      <label>แม่</label>
                      <div className="flex">
                        <div className="w-full">
                          <input
                            disabled={saving}
                            ref={momRef}
                            placeholder="microchip (ถ้ามี)"
                            className="input w-full disabled:bg-slate-200"
                            type="text"
                          ></input>
                          <div>
                            {searching == 1 && momRef.current!.value == ""
                              ? "ไม่พบข้อมูล"
                              : null}
                          </div>
                        </div>

                        <button
                          disabled={saving}
                          onClick={() => handleSearch(1, momRef.current!.value)}
                          className="btn-primary btn disabled:bg-slate-200"
                          type="button"
                        >
                          ค้นหา
                        </button>
                      </div>
                    </div>
                    <div className="form-control">
                      <label>ปู่</label>
                      <div className="flex">
                        <div className="w-full">
                          <input
                            disabled={saving}
                            ref={dGrandPaRef}
                            placeholder="microchip (ถ้ามี)"
                            className="input w-full disabled:bg-slate-200"
                            type="text"
                          ></input>
                          <div>
                            {searching == 6 && dGrandPaRef.current!.value == ""
                              ? "ไม่พบข้อมูล"
                              : null}
                          </div>
                        </div>
                        <button
                          disabled={saving}
                          onClick={() =>
                            handleSearch(6, dGrandPaRef.current!.value)
                          }
                          className="btn-primary btn disabled:bg-slate-200"
                          type="button"
                        >
                          ค้นหา
                        </button>
                      </div>
                    </div>
                    <div className="form-control">
                      <label>ย่า</label>
                      <div className="flex">
                        <div className="w-full">
                          <input
                            disabled={saving}
                            ref={dGrandMaRef}
                            placeholder="microchip (ถ้ามี)"
                            className="input w-full disabled:bg-slate-200"
                            type="text"
                          ></input>
                          <div>
                            {searching == 5 && dGrandMaRef.current!.value == ""
                              ? "ไม่พบข้อมูล"
                              : null}
                          </div>
                        </div>
                        <button
                          disabled={saving}
                          onClick={() =>
                            handleSearch(5, dGrandMaRef.current!.value)
                          }
                          className="btn-primary btn disabled:bg-slate-200"
                          type="button"
                        >
                          ค้นหา
                        </button>
                      </div>
                    </div>
                    <div className="form-control">
                      <label>ตา</label>
                      <div className="flex">
                        <div className="w-full">
                          <input
                            disabled={saving}
                            ref={mGrandPaRef}
                            placeholder="microchip (ถ้ามี)"
                            className="input w-full disabled:bg-slate-200"
                            type="text"
                          ></input>
                          <div>
                            {searching == 3 && mGrandPaRef.current!.value == ""
                              ? "ไม่พบข้อมูล"
                              : null}
                          </div>
                        </div>
                        <button
                          disabled={saving}
                          onClick={() =>
                            handleSearch(3, mGrandPaRef.current!.value)
                          }
                          className="btn-primary btn disabled:bg-slate-200"
                          type="button"
                        >
                          ค้นหา
                        </button>
                      </div>
                    </div>
                    <div className="form-control">
                      <label>ยาย</label>
                      <div className="flex">
                        <div className="w-full">
                          <input
                            disabled={saving}
                            ref={mGrandMaRef}
                            placeholder="microchip (ถ้ามี)"
                            className="input w-full disabled:bg-slate-200"
                            type="text"
                          ></input>
                          <div>
                            {searching == 4 && mGrandMaRef.current!.value == ""
                              ? "ไม่พบข้อมูล"
                              : null}
                          </div>
                        </div>
                        <button
                          disabled={saving}
                          onClick={() =>
                            handleSearch(4, mGrandMaRef.current!.value)
                          }
                          className="btn-primary btn disabled:bg-slate-200"
                          type="button"
                        >
                          ค้นหา
                        </button>
                      </div>
                    </div>

                    <div className="border-2  p-2">
                      <div className="text-xl font-bold text-red-600">
                        ค่าธรรมเนียม 200 บาท
                      </div>
                      <div>กรุณาโอนเงินมาที่หัญชีสมาคม ตามข้อมูลด้านล่าง</div>
                      <div className="rounded-xl bg-slate-200 p-4">
                        <div>ธนาคารกรุงศรีอยุธยา</div>
                        <div>
                          เลขที่บัญชี{" "}
                          <span className="font-bold">438-1-26937-1</span>
                        </div>
                        <div>ชื่อบัญชี สมาคมอนุรักษ์และพัฒนาควายไทย</div>
                      </div>
                    </div>
                    <div className="form-control">
                      <label>แนบสลิปโอนเงิน</label>
                      <div className="flex">
                        <input
                          disabled={saving}
                          {...register("file", { required: true })}
                          accept="image/png, image/jpg"
                          className="file-input disabled:bg-slate-200"
                          type="file"
                        ></input>
                      </div>
                    </div>
                    <button
                      disabled={saving}
                      className="btn-primary btn my-3 w-full disabled:bg-slate-200"
                    >
                      {saving ? "กำลังส่งคำร้อง..." : "ส่งคำร้อง"}
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
      <LoadingDialog message={"กำลังโหลด.."} />
      <AlertMessageDialog
        title="Request Error"
        message="Sending Request Error"
      />
    </div>
  );
};

export default PedigreeRequestForm;
