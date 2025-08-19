// import React, { useContext } from "react";
// import { UserContext } from "../../context/UserContext";
// import Navbar from "./Navbar";
// import SideMenu from "./SideMenu";

// const DashboardLayout = ({ children, activeMenu }) => {
//   const { user, loading } = useContext(UserContext);

//   if (loading) {
//     return (
//       <div className="text-center mt-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="text-center mt-5 text-danger">
//         <h5>User not logged in</h5>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar activeMenu={activeMenu} />

//       <div className="d-flex">
//         <div className="d-none d-lg-block">
//           <SideMenu activeMenu={activeMenu} />
//         </div>

//         <div className="flex-grow-1 mx-5">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

// import React, { useContext } from "react";
// import { UserContext } from "../../context/userContext";
// const DashboardLayout = ({ children, activeMenu }) => {
//   const { user } = useContext(UserContext);

import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-5 text-danger">
        <h5>User not logged in</h5>
      </div>
    );
  }

  return (
    <div className="">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};
export default DashboardLayout;
