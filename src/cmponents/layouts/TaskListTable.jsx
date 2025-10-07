// import React from 'react'
// import moment from 'moment';
// const TaskListTable = (tableData) => {

// const getStatusBadgeColor = (status) => {
// switch (status) {
// case 'Completed' : return 'bg-green-100 text-green-500 border border-green-200;
// case 'Pending' : return 'bg-purple-100 text-purple-500 border border-purple-200;
// case 'In Progress' : return 'bg-cyan-100 text-cyan-500 border border-cyan-200;
// default: return 'bg-gray-100 text-gray-500 border border-gray-200';
// }
// };

// const getPriorityBadgeColor = (priority) => {
// switch (priority) {
// case 'High' : return 'bg-red-100 text-red-500 border border-red-200';
// case 'Medium' : return 'bg-orange-100 text-orange-500 border border-orange-200';
// case 'Low' : return 'bg-green-100 text-green-500 border border-green-200';
// default : return 'bg-gray-100 text-gray-500 border border-gray-200';
// }};

//   return (
//     <div className="overflow-x-auto mt-3 p-0 rounded-lg">
//        <table className="min-w-full">  /*bg-white border rounded */
//         <thead>
//           <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
//             <th className="px-4 py-2 border-b">Name</th>
//             <th className="px-4 py-2 border-b">Status</th>
//             <th className="px-4 py-2 border-b">Priority</th>
//             <th className="px-4 py-2 border-b">Created On</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((task) => (
//             <tr key={task._id} className="text-sm text-gray-700 hover:bg-gray-50">
//               <td className="px-4 py-2 border-b">{task.title}</td>
//               <td className="px-4 py-2 border-b">
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-medium ${
//                     task.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : task.status === "InProgress"
//                       ? "bg-blue-100 text-blue-800"
//                       : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   {task.status}
//                 </span>
//               </td>
//               <td className="px-4 py-2 border-b capitalize">{task.priority}</td>
//               <td className="px-4 py-2 border-b">
//                 {moment(task.createdAt).format("DD MMM YYYY")}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     );
// };

// export default TaskListTable

import React from "react";
import moment from "moment";

const TaskListTable = ({ tableData = [] }) => {
  const getStatusBadgeColor = (status) => {
    switch (status?.trim().toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-500 border border-green-200";
      case "pending":
        return "bg-purple-100 text-purple-500 border border-purple-200";
      case "in progress":
        return "bg-cyan-100 text-cyan-500 border border-cyan-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };
  const getPriorityBadgeColor = (priority) => {
    switch (priority?.trim().toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-500 border border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-500 border border-orange-200";
      case "low":
        return "bg-green-100 text-green-500 border border-green-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };

  return (
    <div className="overflow-x-auto mt-3 p-0 rounded-lg">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
            <th className="py-3 px-4 [text-gray-800 font-medium text-[13px]">
              Name
            </th>
            <th className="py-3 px-4 [text-gray-800 font-medium text-[13px]">
              Status
            </th>
            <th className="py-3 px-4 [text-gray-800 font-medium text-[13px]">
              Priority
            </th>
            <th className="py-3 px-4 [text-gray-800 font-medium text-[13px] hidden md:table-cell">
              Assign On
            </th>
            <th className="py-3 px-4 [text-gray-800 font-medium text-[13px] hidden md:table-cell">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              {/* //   text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-200 */}

              <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">
                {task.title}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                {moment(task.createdAt).format("DD MMM YYYY")}
              </td>
              <td className="px-4 py-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                {moment(task.dueDate).format("DD MMM YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
