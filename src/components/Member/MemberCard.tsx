import { useEffect, useRef, useState } from "react";
import { supabase } from "~/server/supabase";
import { api } from "~/utils/api";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import QrCodeGenerator from "./QrCodeGenerator";
import html2canvas from "html2canvas";
import { HiDocumentDownload } from "react-icons/hi";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoMdArrowRoundBack } from "react-icons/io";

interface MemberCardProps {
  admin: boolean;
  wallet: string;
  isLifeTime: boolean;
  name: string;
  avatar: string;
  isPublic: boolean;
}

const MemberCard = ({
  admin,
  isLifeTime,
  name,
  wallet: outsideWallet,
  avatar: outsideAvatar,
  isPublic,
}: MemberCardProps) => {
  const { back } = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string>("/images/Member.jpg");
  const { wallet, tokens } = useBitkubNext();
  const { data: user } = api.user.get.useQuery({
    wallet: wallet! as string,
    accessToken: tokens!.access_token as string,
  });

  useEffect(() => {
    void handleSetImage();
  }, [user, outsideAvatar, outsideWallet]);

  const handleSetImage = () => {
    if (user == undefined && outsideAvatar !== undefined && isPublic) {
      const { data } = supabase.storage
        .from("slipstorage/avatar")
        .getPublicUrl(`${outsideAvatar}`);

      if (data != undefined) {
        setImage(data.publicUrl);
      } else {
        admin
          ? setImage("/images/Committee.jpg")
          : setImage("/images/Member.jpg");
      }
    } else if (user!.avatar == null || user!.avatar == undefined) {
      admin
        ? setImage("/images/Committee.jpg")
        : setImage("/images/Member.jpg");
    } else if (!isPublic) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const { data } = supabase.storage
        .from("slipstorage/avatar")
        .getPublicUrl(`${user!.avatar}`);
      if (data != undefined) {
        setImage(data.publicUrl);
      } else {
        admin
          ? setImage("/images/Committee.jpg")
          : setImage("/images/Member.jpg");
      }
    }
  };

  const handleDownload = async () => {
    if (!cardRef) return;
    const canvas = await html2canvas(cardRef.current!);
    const data = canvas.toDataURL("image/png");
    //vertual link element created
    const link = document.createElement("a");

    link.href = data;
    link.download = `kwaithai-member-${new Date().getTime()}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        ref={cardRef}
        className="card card-compact relative w-96 max-w-md overflow-hidden rounded-xl bg-base-100 text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <div className="flex items-center justify-center gap-4 bg-slate-50 py-3">
          <figure className="relative h-[50px] w-[50px]">
            <Image src="/images/logo.png" alt="logo" fill />
          </figure>
          <div>
            <h1 className="font-bold">สมาคมอนุรักษ์​ และ พัฒนาควายไทย</h1>
            <p>บัตรประจำตัวสมาชิก</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <figure className="relative h-[350px] w-[350px] overflow-hidden rounded-xl px-3 py-3">
            <Image src={image} fill alt="member-image" />
          </figure>
        </div>

        <div className="card-body bg-slate-50">
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex flex-col items-start gap-3">
              <div>
                <div className="text-xl font-bold">
                  {admin ? "COMMITTEE" : "MEMBER"}
                </div>
                {wallet ? (
                  <div className="text-sm font-bold leading-[0.6rem] text-gray-500">{`${wallet.slice(
                    0,
                    5
                  )}...${wallet.slice(38)}`}</div>
                ) : (
                  <div className="text-sm font-bold leading-[0.6rem] text-gray-500">{`${outsideWallet.slice(
                    0,
                    5
                  )}...${outsideWallet.slice(38)}`}</div>
                )}
              </div>
              <div className="text-md font-bold">
                <span>TYPE: </span> {isLifeTime ? "ตลอดชีพ" : "รายปี"}{" "}
              </div>

              <div className="text-md font-bold">
                <div>COLLECTION:</div>
                <div>KWAITHAI ASSOCIATION</div>
              </div>

              <div className="text-md font-bold">{name}</div>
            </div>

            <div>
              <QrCodeGenerator
                value={`https://kwaithai.com/member/${wallet!}`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 flex w-full justify-between px-10">
        <button
          onClick={() => back()}
          className="btn-circle btn ring ring-gray-400 hover:btn-primary hover:ring-green-400"
        >
          <IoMdArrowRoundBack size={24} />
        </button>
        <button
          onClick={() => void handleDownload()}
          className="btn-circle btn ring ring-gray-400 hover:btn-primary hover:ring-green-400"
        >
          <HiDocumentDownload size={24} />
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
