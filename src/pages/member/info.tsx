import { useRouter } from "next/router";
import { RefObject, useEffect, useRef, useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useIsAdmin } from "~/blockchain/MemberNFT/read";
import { Layout } from "~/components/Shared/Layout";
import Loading from "~/components/Shared/LoadingIndicator";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { supabase } from "~/server/supabase";
import { api } from "~/utils/api";

const MemberInfoPage = () => {
  const [image, setImage] = useState<string>("/images/Member.jpg");
  const [editing, setEditing] = useState<boolean>(false);
  const { wallet, tokens, isConnected } = useBitkubNext();
  const {
    data: user,
    isLoading: loadingUser,
    refetch,
  } = api.user.get.useQuery({
    wallet: wallet as string,
    accessToken: tokens?.access_token as string,
  });

  //@dev: Editors
  const {
    mutate: editName,
    isSuccess: nameEdited,
    isError: nameEditError,
  } = api.user.updateName.useMutation();
  const {
    mutate: editAddr,
    isSuccess: addrEdited,
    isError: addrEditError,
  } = api.user.updateAddr.useMutation();
  const {
    mutate: editTel,
    isSuccess: telEdited,
    isError: telEditError,
  } = api.user.updateTel.useMutation();
  const {
    mutate: editEmail,
    isSuccess: emailEdited,
    isError: emailEditError,
  } = api.user.updateEmail.useMutation();

  useEffect(() => {
    if (nameEdited || addrEdited || telEdited || emailEdited) {
      toast.success("แก้ไข้ข้อมูลส่วนตัวสำเร็จ!");
      void refetch();
      setEditing(false);
    }

    if (nameEditError || addrEditError || telEditError || emailEditError) {
      toast.error("แก้ไข้ไม่สำเร็จ!");
      void refetch();
      setEditing(false);
    }
  }, [
    nameEdited,
    nameEditError,
    addrEdited,
    addrEditError,
    telEdited,
    telEditError,
    emailEdited,
    emailEditError,
  ]);

  //Editors End

  const { admin, isSuccess, isLoading: loadingAdmin, isError } = useIsAdmin();

  useEffect(() => {
    void handleSetImage();
  }, [user]);

  const handleSetImage = async () => {
    if (!user) return;
    if (user.avatar == null || user.avatar == undefined) {
      admin
        ? setImage("/images/Committee.jpg")
        : setImage("/images/Member.jpg");
    } else {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const { data } = await supabase.storage
        .from("slipstorage/avatar")
        .getPublicUrl(`${user.avatar}`);
      if (data != undefined) {
        setImage(data.publicUrl);
      } else {
        admin
          ? setImage("/images/Committee.jpg")
          : setImage("/images/Member.jpg");
      }
    }
  };

  function handleEditName(ref: RefObject<HTMLInputElement>) {
    if (
      ref.current?.value == "" ||
      ref.current?.value == undefined ||
      ref.current?.value == null
    ) {
      setEditing(false);
    } else {
      setEditing(true);
      editName({ wallet: wallet as string, name: ref.current?.value });
      ref.current.value = "";
    }
  }
  function handleEditAddress(ref: RefObject<HTMLInputElement>) {
    if (
      ref.current?.value == "" ||
      ref.current?.value == undefined ||
      ref.current?.value == null
    ) {
      setEditing(false);
    } else {
      setEditing(true);
      editAddr({ wallet: wallet as string, addr: ref.current?.value });
      ref.current.value = "";
    }
  }
  function handleEditEmail(ref: RefObject<HTMLInputElement>) {
    if (
      ref.current?.value == "" ||
      ref.current?.value == undefined ||
      ref.current?.value == null
    ) {
      setEditing(false);
    } else {
      setEditing(true);
      editEmail({ wallet: wallet as string, email: ref.current?.value });
      ref.current.value = "";
    }
  }
  function handleEditTel(ref: RefObject<HTMLInputElement>) {
    if (
      ref.current?.value == "" ||
      ref.current?.value == undefined ||
      ref.current?.value == null
    ) {
      setEditing(false);
    } else {
      setEditing(true);
      editTel({ wallet: wallet as string, tel: ref.current?.value });
      ref.current.value = "";
    }
  }

  return (
    <Layout>
      {user! ? (
        <div className="grid-col-1 mt-5  grid gap-2 w768:mt-[4.5rem] w1024:mt-[6rem] w1440:mt-[8rem]">
          <div className="flex justify-center">
            <div className="avatar relative my-2">
              <div className="w-24 rounded-full ring ring-slate-400 ring-offset-2 ring-offset-base-100">
                <img src={image} />
              </div>
              <button
                onClick={() => window.edit_profile_dialog.showModal()}
                className="btn-primary btn-xs btn-circle btn absolute bottom-0 right-0"
              >
                <RiEdit2Line size={16} />
              </button>
            </div>
          </div>
          <div className="flex w-full items-center justify-center py-2">
            <div className="join-vertical join w-full w768:max-w-sm">
              <UserInfoAccordianItem
                title="ชื่อ"
                content={user.name ?? "ไม่มีข้อมูล"}
                placeholder={user.name ?? "ไม่มีข้อมูล"}
                action={handleEditName}
                loading={editing}
                disabled={editing}
                buttonName="แก้ไข"
              />
              <UserInfoAccordianItem
                title="ที่อยู่"
                content={user.address ?? "ไม่มีข้อมูล"}
                placeholder={user.address ?? "ไม่มีข้อมูล"}
                action={handleEditAddress}
                loading={editing}
                disabled={editing}
                buttonName="แก้ไข"
              />
              <UserInfoAccordianItem
                title="โทรศัพท์"
                content={user.tel ?? "ไม่มีข้อมูล"}
                placeholder={user.tel ?? "ไม่มีข้อมูล"}
                action={handleEditTel}
                loading={editing}
                disabled={editing}
                buttonName="แก้ไข"
              />
              <UserInfoAccordianItem
                title="อีเมล"
                content={user.email ?? "ไม่มีข้อมูล"}
                placeholder={user.email ?? "ไม่มีข้อมูล"}
                action={handleEditEmail}
                loading={editing}
                disabled={editing}
                buttonName="แก้ไข"
              />
              <UserInfoAccordianItem
                title="Bitkub next"
                content={
                  wallet
                    ? `${wallet?.slice(0, 6)}...${wallet?.slice(38)}`
                    : "N/A"
                }
                placeholder="ไม่สามารถแก้ไขได้"
                loading={false}
                disabled={true}
                buttonName="-"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[80vh] w-full items-center justify-center">
          <Loading />
        </div>
      )}
    </Layout>
  );
};

interface UserInfoAccordianItemProps {
  title: string;
  content: string;
  placeholder: string;
  buttonName: string;
  action?: (ref: RefObject<HTMLInputElement>) => void;
  disabled: boolean;
  loading: boolean;
}

function UserInfoAccordianItem({
  title,
  content,
  placeholder,
  buttonName,
  disabled,
  loading,
  action,
}: UserInfoAccordianItemProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="collapse-arrow join-item collapse border border-base-300">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title">
          <div className="text-md  font-medium text-slate-600">{title}</div>
          <div className="text-slate-500">{content}</div>
        </div>
        <div className="collapse-content flex">
          <div className="form-control">
            <input
              ref={ref}
              required
              disabled={disabled}
              placeholder={placeholder}
              className="input-bordered input input-sm max-w-md"
            ></input>
          </div>
          <button
            disabled={disabled}
            onClick={action ? () => action(ref) : undefined}
            className="btn-primary btn-outline btn-sm btn"
          >
            {loading ? <Loading /> : buttonName}
          </button>
        </div>
      </div>
    </>
  );
}

export default MemberInfoPage;
