import React from "react";
import { api } from "../../utils/api";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useEffect, useState } from "react";
import MicrochipSearch from "../Shared/MicrochipSearch";
import MemberBuffaloCard from "./MemberBuffalo";
import MemberPedigreeCard from "./MemberPedigree";
import MemberModalDialog from "./MemberTrackerDialog";

function InformationGridV2() {
  const { wallet, tokens } = useBitkubNext();
  const { data: user } = api.user.get.useQuery({
    accessToken: tokens?.access_token as string,
    wallet: wallet as string,
  });

  return (
    <>
      <div className="grid min-w-[320px] grid-cols-1">
        <div className="flex flex-col gap-2">
          <div className="text-xl">
            <span className="font-bold">wallet: </span>
            {wallet != undefined
              ? `${wallet?.slice(0, 6)}...${wallet?.slice(38)}`
              : "N/A"}{" "}
          </div>
          <div className="text-xl">
            <span className="font-bold">email:</span> N/A
          </div>
          <div className="flex">
            {/* <div
              className="btn rounded-xl bg-[#55ff34] font-bold text-black"
              onClick={() => window.member_dialog.showModal()}
            >
              Verify
            </div> */}
            <MemberModalDialog />
          </div>
        </div>
      </div>
      <div className="py-2">
        <MicrochipSearch />
      </div>
      <div>
        <div className="my-2 flex flex-col gap-3 w768:flex-row">
          <MemberBuffaloCard />
          <MemberPedigreeCard />
        </div>
      </div>
    </>
  );
}

export default InformationGridV2;
