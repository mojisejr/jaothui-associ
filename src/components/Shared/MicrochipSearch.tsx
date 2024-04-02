import React from "react";
import { ImSearch } from "react-icons/im";
import { useRef } from "react";

function MicrochipSearch() {
  const searchInput = useRef<HTMLInputElement>(null);

  function handleSearch() {
    if (window !== undefined) {
      window.open(`https://jaothui.com/cert/${searchInput.current!.value}`);
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
      <button className="text-slate-700" onClick={handleSearch}>
        <ImSearch size={30} />
      </button>
    </div>
  );
}

export default MicrochipSearch;
