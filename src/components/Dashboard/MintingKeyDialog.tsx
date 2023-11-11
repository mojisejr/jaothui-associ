import { type Address } from "viem";
import Modal from "../Shared/Modal";
import { useEffect, useRef } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useBitkubNext } from "~/contexts/bitkubNextContext";
import Loading from "../Shared/LoadingIndicator";

const MintingKeyDialog = ({ wallet }: { wallet: Address }) => {
  const { wallet: walletAddress } = useBitkubNext();

  const { refetch } = api.minter.getMintable.useQuery();

  const {
    mutate: mintNFT,
    isLoading: minting,
    isSuccess: minted,
    isError: mintingError,
  } = api.minter.mint.useMutation();

  const keyRef = useRef<HTMLInputElement>(null);
  const mint = () => {
    mintNFT({
      wallet: walletAddress!,
      to: wallet,
      mintingKey: keyRef.current!.value,
    });
  };

  useEffect(() => {
    if (minted) {
      toast.success(`NFT is minted!, check bkcscan.com`);
      window.key_dialog.close();
    }

    if (mintingError) {
      toast.error("NFT minting error");
      window.key_dialog.close();
    }

    void refetch();
  }, [minted, mintingError]);

  useEffect(() => {
    void refetch();
  }, []);

  return (
    <Modal id="key_dialog">
      <div className="join w-full">
        <input
          disabled={minting}
          className="input-bordered input join-item"
          type="password"
          placeholder="minting key"
          ref={keyRef}
        />
        <button
          disabled={minting}
          onClick={mint}
          className="btn-info join-item btn"
        >
          {!minting ? (
            "Mint"
          ) : (
            <div className="flex items-center gap-2">
              <Loading /> Minting..
            </div>
          )}
        </button>
      </div>
    </Modal>
  );
};
export default MintingKeyDialog;
