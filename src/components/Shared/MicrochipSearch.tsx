import React, { useRef } from "react";
import { ImSearch } from "react-icons/im";

function MicrochipSearch() {
  const searchInput = useRef<HTMLInputElement>(null);

  function handleSearch() {
    // Guard the ref and normalize input value
    const inputEl = searchInput.current;
    const raw = inputEl?.value ?? "";
    const query = raw.trim();
    if (!query) return;

    // Avoid ReferenceError in non-browser environments
    if (typeof window === "undefined") return;

    // Test whether the input starts with a digit
    const startedWithNumber = /^[0-9]/.test(query);

    if (startedWithNumber) {
      // Numeric query -> direct certificate page
      window.open(
        `https://jaothui.com/cert/${encodeURIComponent(query)}`
      );
    } else {
      // Non-numeric query -> search page
      window.open(
        `https://jaothui.com/cert/search?q=${encodeURIComponent(query)}`
      );
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
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
        onKeyPress={handleKeyPress}
      />
      <button
        className="text-slate-700"
        onClick={handleSearch}
      >
        <ImSearch size={30} />
      </button>
    </div>
  );
}

export default MicrochipSearch;
