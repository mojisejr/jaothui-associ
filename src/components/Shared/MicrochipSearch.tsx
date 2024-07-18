import React from "react";
import { ImSearch } from "react-icons/im";
import { useRef } from "react";
import { api } from "~/utils/api";

function MicrochipSearch() {
  const searchInput = useRef<HTMLInputElement>(null);

  const { data: allMetadata, isLoading } =
    api.microchip.getAllMetadata.useQuery();

  function handleSearch() {
    if (isLoading) return;
    const startedWithNumber = /^[0-9]/.test(searchInput.current!.value.trim());

    if (window !== undefined && startedWithNumber) {
      const index = allMetadata?.findIndex(
        (m) => m.certify.microchip == searchInput.current!.value
      );

      console.log(index);

      if (index === undefined) return;

      window.open(
        `https://jaothui.com/cert/${searchInput.current!.value}?i=${index + 1}`
      );
    } else {
      window.open(
        `https://jaothui.com/cert/search?q=${searchInput.current!.value}`
      );
    }
  }

  return (
    <div className="z-10 flex gap-3 rounded-full border-[1px] border-slate-500 bg-white p-1 pr-3">
      <input
        type="text"
        placeholder="MICROCHIP ID..."
        maxLength={15}
        className="input input-sm w-full max-w-[420px] rounded-full text-black focus:outline-none"
        ref={searchInput}
      ></input>
      <button
        disabled={isLoading}
        className="text-slate-700"
        onClick={handleSearch}
      >
        <ImSearch size={30} />
      </button>
    </div>
  );
}

export default MicrochipSearch;
