// import React, { useState } from 'react';
// import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
// import SideMenu from './SideMenu';

// const Navbar = ({ activeMenu }) => {
//   const [openSideMenu, setOpenSideMenu] = useState(false);

//   return (
//     <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom shadow-sm position-relative">
//       {/* Toggle Button - visible only on small screens */}
//       <button
//         className="btn btn-outline-dark d-lg-none"
//         onClick={() => setOpenSideMenu(!openSideMenu)}
//       >
//         {openSideMenu ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
//       </button>

//       {/* Title */}
//       <h2 className="text-3xl text-rose-600'">Task Manager</h2>

//       {/* Optional space filler for alignment */}
//       <div className="d-lg-none" style={{ width: '40px' }} />
      
//       {/* Slide-out SideMenu */}
//       {openSideMenu && (
//         <div
//           className="position-fixed top-0 start-0 bg-white h-100 shadow"
//           style={{ width: '250px', zIndex: 1050 }}
//         >
//           <SideMenu activeMenu={activeMenu} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Navbar;


import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      {/* Toggle Button */}
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {/* App Title */}
      <h2 className="text-lg font-medium text-black">Task Manager</h2>

      {/* Mobile Side Menu */}
      {openSideMenu && (
        <div className="fixed top-[61px] left-0 z-40 bg-white w-64 shadow-md h-full">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
