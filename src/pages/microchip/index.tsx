import React, { useEffect } from "react";
import MicrochipTable from "~/components/Microchip/MicrochipTable";
import Link from "next/link";
import { Layout } from "~/components/Shared/Layout";
import { BiSolidMicrochip } from "react-icons/bi";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Microchip = () => {
  const { replace } = useRouter();
  const { isConnected } = useBitkubNext();
  const { data: inventory, isLoading: inventoryLoading } =
    api.microchip.getAll.useQuery();

  useEffect(() => {
    if (!isConnected) {
      void replace("/");
    }
  }, []);

  return (
    <Layout>
      <div className="mt-[90px] h-[90vh] w-full">
        <div className="grid grid-cols-1 px-10">
          <div className="place-self-end">
            {inventory == undefined || inventory.count <= 0 ? null : (
              <ul className="menu rounded-box menu-horizontal">
                <li>
                  <Link href="/microchip/buy?installHere=true">
                    <BiSolidMicrochip />
                    Buy & Install
                  </Link>
                </li>
                <li>
                  <Link href="/microchip/buy?installHere=false">
                    <BiSolidMicrochip />
                    Buy Online
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="overflow-auto">
            <MicrochipTable />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Microchip;
