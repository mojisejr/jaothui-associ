import { useState, useEffect } from "react";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { api } from "~/utils/api";
import { supabase } from "~/server/supabase";
import MemberModalDialogV2 from "./MemberTrackerDialogV2";
import { RiEdit2Line } from "react-icons/ri";
import EditProfileModal from "./EditProfileModal";

interface ProfileHeaderProps {
  admin: boolean;
  wallet: string;
  isLifeTime: boolean;
  name: string;
  avatar: string;
}

const ProfileHeader = ({ admin, isLifeTime, name }: ProfileHeaderProps) => {
  const [image, setImage] = useState<string>("/images/Member.jpg");
  const { wallet, tokens } = useBitkubNext();
  const { data: user, isLoading } = api.user.get.useQuery({
    wallet: wallet as string,
    accessToken: tokens?.access_token as string,
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
    <div className="max-h-[200px] bg-base-200 px-3 py-2">
      <div className="flex items-center gap-4">
        <div className="avatar relative">
          <div className="w-24 rounded-full">
            <img src={image} />
          </div>
          <button
            onClick={() => window.edit_profile_dialog.showModal()}
            className="btn-primary btn-xs btn-circle btn absolute bottom-0 right-0"
          >
            <RiEdit2Line size={16} />
          </button>
        </div>
        <div className="grid-col-1 grid gap-[2px]">
          <div className="text-sm font-bold">{user?.name}</div>
          <div className="text-xs font-semibold text-slate-500">
            {admin ? "Commitee" : "Member"}
          </div>
          <MemberModalDialogV2 />
          {/* <div className="badge rounded-xl bg-[#55ff34]">verified</div> */}
        </div>
      </div>
      <EditProfileModal />
    </div>
  );
};

export default ProfileHeader;
