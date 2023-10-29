import React, { useState, useRef, SyntheticEvent, useEffect } from "react";
import Modal from "../Shared/Modal";
import { toast } from "react-toastify";
import { supabase } from "~/server/supabase";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import Loading from "../Shared/LoadingIndicator";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

interface InputTypes {
  image?: string;
}

//1. check if profile exist?
//2. if not show input form if existed show reset button

//update flow
//1. get file url
//2. upload file get back url
//3. show url instead of base image;

const EditProfileModal = () => {
  const { replace } = useRouter();
  const { wallet, tokens } = useBitkubNext();
  const { data: user } = api.user.get.useQuery({
    wallet: wallet as string,
    accessToken: tokens!.access_token as string,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    isLoading: savingToDb,
    isSuccess: savedToDb,
    isError: saveToDbError,
    mutate: saveToDb,
  } = api.user.updateAvatar.useMutation();

  useEffect(() => {
    if (savingToDb) {
      setIsLoading(true);
    }

    if (savedToDb) {
      toast.success("You avatar updated successfully");
      void replace({
        pathname: "/success",
        query: {
          title: "Success!",
          content: "Your Profile image is updated.",
          backPath: "/member/card",
        },
      });
      setIsLoading(false);
    }

    if (saveToDbError) {
      setIsLoading(false);
      toast.error("error on saving to DB");
    }
  }, [savingToDb, savedToDb, saveToDbError]);

  const save = async () => {
    if (inputRef.current?.value == undefined || inputRef.current?.value == "") {
      toast.error("no file selected");
      return;
    }
    setIsLoading(true);
    const filename = inputRef.current?.value;
    const fileBolb = inputRef.current?.files![0];
    const extension = fileBolb?.name.split(".")[1];

    if (fileBolb!.size > 1000000) {
      toast.error("Cannot upload file that larger than 1 Mb");
      setIsLoading(false);
    } else {
      const { data, error } = await supabase.storage
        .from("slipstorage/avatar")
        .upload(`${wallet!}.${extension as string}`, fileBolb!, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.log(error);
        toast.error("Upload file error, try again.");
        setIsLoading(false);
      } else {
        saveToDb({ wallet: wallet as string, filename: data.path });
        console.log("uploaded avatar infomation: ", data);
      }
    }
  };

  const reset = async () => {
    setIsLoading(true);
    const { error } = await supabase.storage
      .from("slipstorage")
      .remove([`avatar/${user?.avatar as string}`]);
    if (!error) {
      saveToDb({ wallet: wallet as string, filename: null });
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Modal id="edit_profile_dialog">
      <>
        <div className="grid w-full grid-cols-1">
          <div className="grid-col-1 grid gap-2">
            <div className="form-control">
              <input
                disabled={isLoading}
                ref={inputRef}
                className="mx-w-xs rouneded-box file-input-bordered file-input"
                type="file"
                name="avatar"
                accept="image/png, image/jpg, image/jpeg"
                required
              />
              <label className="label">
                <span className="label-text-alt"></span>
                <span className="label-text-alt">less than 1 Mb</span>
              </label>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex gap-2">
                <button
                  disabled={isLoading}
                  onClick={void save}
                  className="rouneded-box btn-primary btn"
                >
                  Save
                </button>
                <button
                  disabled={
                    isLoading ||
                    user?.avatar == null ||
                    user?.avatar == undefined
                  }
                  onClick={void reset}
                  className="btn-error rounded-box btn"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    </Modal>
  );
};

export default EditProfileModal;
