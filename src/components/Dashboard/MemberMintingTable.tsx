import React, { useState } from "react";
import { api } from "~/utils/api";
import Loading from "../Shared/LoadingIndicator";
import MintingKeyDialog from "./MintingKeyDialog";
import { type Address } from "viem";
import { BiRefresh } from "react-icons/bi";

const MemberMintingTable = () => {
  const [selectedWallet, setSelectedWallet] = useState<Address>();
  const {
    data: mintables,
    isLoading: mintableLoading,
    refetch,
  } = api.minter.getMintable.useQuery();

  const handleMint = (wallet: Address) => {
    setSelectedWallet(wallet);
    window.key_dialog.showModal();
  };

  const handleRefresh = () => {
    void refetch();
  };

  return (
    <>
      <div className="flex justify-end px-3">
        <button
          disabled={mintableLoading}
          onClick={handleRefresh}
          className="btn-primary btn-xs btn flex items-center"
        >
          <BiRefresh size={18} /> {!mintableLoading ? "refresh" : "refreshing"}
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>wallet</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {mintableLoading ? (
            <Loading />
          ) : (
            <>
              {mintables == undefined && mintables!.mintable.length <= 0 ? (
                <div>No data</div>
              ) : (
                <>
                  {mintables?.mintable.map(
                    (data: { wallet: Address; role: string }) => (
                      <tr key={data.wallet}>
                        <td className="w1024:hidden">{`${data.wallet.slice(
                          0,
                          5
                        )}...${data.wallet.slice(38)}`}</td>
                        <td className="hidden w1024:block">{data.wallet}</td>
                        <td>
                          <button
                            onClick={() => handleMint(data.wallet)}
                            className="btn-info btn-xs btn"
                          >
                            Mint
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </>
              )}
            </>
          )}
        </tbody>
      </table>
      <MintingKeyDialog wallet={selectedWallet!} />
    </>
  );
};

export default MemberMintingTable;
