import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "~/server/supabase";
import { api } from "~/utils/api";
import { useBitkubNext } from "~/contexts/bitkubNextContext";

interface MemberCardProps {
  admin: boolean;
  wallet: string;
  isLifeTime: boolean;
  name: string;
  avatar: string;
}

const MemberCard = ({ admin, isLifeTime, name }: MemberCardProps) => {
  const [image, setImage] = useState<string>("/images/Member.jpg");
  const { wallet, tokens } = useBitkubNext();
  const { data: user } = api.user.get.useQuery({
    wallet: wallet! as string,
    accessToken: tokens!.access_token as string,
  });

  useEffect(() => {
    void handleSetImage();
  }, [user]);

  const handleSetImage = async () => {
    if (user!.avatar == null || user!.avatar == undefined) {
      admin
        ? setImage("/images/Committee.jpg")
        : setImage("/images/Member.jpg");
    } else {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const { data } = await supabase.storage
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

  return (
    <>
      <div className="card card-compact relative w-96 max-w-md rounded-xl bg-base-100 text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <figure className="px-3 py-3">
          <img
            className="h-[350px] w-[350px] overflow-hidden rounded-xl object-contain object-center"
            src={image}
            width={350}
            height={350}
            alt="member-image"
          />
        </figure>
        <div className="card-body">
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex flex-col items-start gap-3">
              <div>
                <div className="text-xl font-bold">
                  {admin ? "COMMITTEE" : "MEMBER"}
                </div>
                <div className="text-sm font-bold leading-[0.6rem] text-gray-500">{`${wallet!.slice(
                  0,
                  5
                )}...${wallet!.slice(38)}`}</div>
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
              <Image
                className="relative"
                src="/images/QR.png"
                width={150}
                height={150}
                alt="QR-code"
              />
              {/* <MemberCardMenu /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberCard;
