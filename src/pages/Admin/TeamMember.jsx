// import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "../../context/UserContext";
// import { useUserAuth } from "../../hooks/useUserAuth";
// import DashboardLayout from "../../cmponents/layouts/DashboardLayout";
// import { API_PATHS } from "../../utils/apiPaths";
// import axiosinstance from "../../utils/axiosinstance";
// import { LuFileSpreadsheet } from "react-icons/lu";
// import UserCard from "../../cmponents/layouts/Cards/UserCard";
// import { Toaster, toast } from "react-hot-toast";
// const ManageTask = () => {
//   const [allUsers, setAllUsers] = useState([]);

//   const getAllUsers = async () => {
//     try {
//       const response = await axiosinstance.get(API_PATHS.USERS.GET_USERS);
//       if (response.data?.length > 0) {
//         setAllUsers(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

// const handleDownloadReport = async () => {
//   try {
//     const response = await axiosinstance.get(API_PATHS.REPORT.EXPORT_USER, {
//       responseType: "blob",
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "user_details.xlsx");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link); // more consistent than parentElement check
//     URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Error downloading user details", error);
//     toast.error("Failed to download user details. Please try again.");
//   }
// };

//   useEffect(() => {
//     getAllUsers();
//     return () => {};
//   }, []);

//   return (
//     <DashboardLayout activeMenu="Team Member">
//       <div className="mt-5 mb-10">
//         <div className="flex md: flex-row md : items-center justify-between">
//         <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
//           <button
//             className="flex md:flex  items-center gap-3 text-xs md:text-[13px] text-lime-900 bg-lime-100 px:2 md:px-3 py-2 rounded border border-lime-200  hover:border-lime-400 cursor-pointer"
//             onClick={handleDownloadReport}
//           >
//             <LuFileSpreadsheet className="text-lg" />
//             Download Report
//           </button>

//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//           {allUsers?.map((user)=>
//           <UserCard key={user._id} userInfo={user}/>
//           )}
//           </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ManageTask;

import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../cmponents/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosinstance from "../../utils/axiosinstance";
import { LuFileSpreadsheet } from "react-icons/lu";
import { PiFilePdfDuotone } from "react-icons/pi";
import UserCard from "../../cmponents/layouts/Cards/UserCard";
import { Toaster, toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
const ManageTask = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosinstance.get(API_PATHS.USERS.GET_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const data = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
  ];

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Add Title (Tailwind: text-2xl font-bold text-blue-600 text-center)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // Tailwind text-blue-600
    doc.text("Team Member Report", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    // Table headers (Tailwind: bg-blue-100 text-blue-700 font-bold)
    const headers = [["Name", "Email", "Pending", "In-Progress", "Completed"]];

    const rows = allUsers.map((user) => {
      const {
        name,
        email,
        completedTasksCount = 0,
        pendingTasksCount = 0,
        inProgressTasksCount = 0,
      } = user;

      return [
        name,
        email,
        pendingTasksCount,
        inProgressTasksCount,
        completedTasksCount,
      ];
    });

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [219, 234, 254],
        textColor: [30, 64, 175],
        fontStyle: "bold",
        halign: "center",
        font: "helvetica",
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        textColor: [0, 0, 0],
        font: "helvetica",
        fontSize: 10,
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      margin: { left: 14, right: 14 },
    });

    doc.save("team_member_report.pdf");
  };

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // 🔹 Fetch image from /public folder
    const response = await fetch(
      "http://localhost:8000/uploads/1753343041211-profile.jpg"
    ); // relative to /public
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // 🔹 Add the logo to workbook
    const imageId = workbook.addImage({
      buffer: arrayBuffer,
      extension: "png",
    });

    // 🔹 Place the logo in sheet
    worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 }, // top-left
      ext: { width: 150, height: 80 },
    });

    // 🔹 Add some space after logo
    worksheet.addRow([]);
    worksheet.addRow([]);

    // 🔹 Add Header Row
    const headerRow = worksheet.addRow(["Name", "Email", "Phone", "Status"]);

    // Style header cells
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E78" }, // dark blue
      };
      cell.font = {
        color: { argb: "FFFFFFrFF" },
        bold: true,
        size: 12,
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // 🔹 Add sample data
    worksheet.addRows([
      ["John Doe", "john@example.com", "1234567890", "Active"],
      ["Jane Smith", "jane@example.com", "0987654321", "Inactive"],
    ]);

    // 🔹 Adjust column widths
    worksheet.columns = [
      { width: 20 },
      { width: 30 },
      { width: 20 },
      { width: 15 },
    ];

    // 🔹 Save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Report.xlsx");
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Member">
      <div className="mt-5 mb-10">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="text-xl font-medium">Team Members</h2>
          <div className="flex gap-2">
            {/* <button
              className="flex items-center gap-2 text-xs md:text-sm text-lime-900 bg-lime-100 px-3 py-2 rounded border border-lime-200 hover:border-lime-400"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Excel Report
            </button> */}
            <button
              className="flex items-center gap-2 text-xs md:text-sm text-lime-900 bg-lime-100 px-3 py-2 rounded border border-lime-200 hover:border-lime-400"
              onClick={handleDownloadPdf}
            >
              <PiFilePdfDuotone className="text-lg" />
              Download User Report
            </button>

            <button
              className="flex items-center gap-2 text-xs md:text-sm text-lime-900 bg-lime-100 px-3 py-2 rounded border border-lime-200 hover:border-lime-400"
              onClick={handleDownload}
            >
              <PiFilePdfDuotone className="text-lg" />
              Download User Report xecel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTask;
