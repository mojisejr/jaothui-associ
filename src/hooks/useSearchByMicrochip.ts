import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Metadata } from "~/interfaces/Metadata";
import { api } from "~/utils/api";

export const useSearchByMicrochip = () => {
  const [currentMicrochip, setCurrentMicrochip] = useState<string>();
  const [currentMetadata, setCurrentMetadata] = useState<Metadata>();

  const {
    data: metadata,
    mutate: search,
    isLoading,
    isSuccess,
    isError,
  } = api.pedigrees.getByMicrochipForPedigreeRequest.useMutation();

  useEffect(() => {
    if (isSuccess) {
      setCurrentMetadata(metadata as unknown as Metadata);
    }

    if (isError) {
      setCurrentMetadata(undefined);
      setCurrentMicrochip(undefined);
    }
  }, [isSuccess, isError]);

  const searchByMicrochip = (microchip: string) => {
    setCurrentMicrochip(microchip);
    if (!microchip) {
      toast.error("need to provide microchip Id");
      return;
    }
    search({ microchip });
  };

  return {
    currentMetadata,
    currentMicrochip,
    searchByMicrochip,
    isSuccess,
    isLoading,
    isError,
  };
};
