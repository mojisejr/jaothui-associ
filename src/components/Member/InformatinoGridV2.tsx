import React from "react";
import MicrochipSearch from "../Shared/MicrochipSearch";
import MemberBuffaloCard from "./MemberBuffalo";
import MemberPedigreeCard from "./MemberPedigree";
import MemberModalDialog from "./MemberTrackerDialog";

function InformationGridV2() {
  return (
    <>
      <div className="py-2">
        <MicrochipSearch />
      </div>
      <div>
        <div className="my-2 flex flex-col items-center justify-center gap-3 w768:flex-row">
          <MemberBuffaloCard />
          <MemberPedigreeCard />
        </div>
      </div>
      <div className="grid min-w-[320px] grid-cols-1">
        <div className="flex flex-col gap-2">
          <MemberModalDialog />
          {/* <div className="text-xl">
            <span className="font-bold">wallet: </span>
            {wallet != undefined
              ? `${wallet?.slice(0, 6)}...${wallet?.slice(38)}`
              : "N/A"}{" "}
          </div>
          <div className="text-xl">
            <span className="font-bold">email:</span>{" "}
            {user ? user?.email : "N/A"}
          </div> */}
        </div>
      </div>
    </>
  );
}

export default InformationGridV2;
