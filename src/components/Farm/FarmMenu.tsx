import React from "react";
import AddFarmModal from "../Member/AddFarmModal";
import {BiSolidLocationPlus } from 'react-icons/bi'

const FarmMenu = () => {
  const addFarm = () => {
    window.edit_farm_dialog.showModal();
  };

  return (
    <>
      <details className="dropdown-end dropdown">
        <summary className="btn m-1">Menu</summary>
        <ul className="dropdown-content menu rounded-box z-[1] w-52 bg-base-100 p-2 shadow">
          <li>
            <a onClick={addFarm}><BiSolidLocationPlus /> Add Farm</a>
          </li>
        </ul>
      </details>
      <AddFarmModal />
    </>
  );
};

export default FarmMenu;
