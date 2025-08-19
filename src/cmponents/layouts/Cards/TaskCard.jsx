import React, { useState } from "react";
import Progress from "../../layouts/Progress";
import AvtarGroup from "../../layouts/AvtarGroup";
import { LuPaperclip } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  createdAt,
  dueDate,
  
  assignTo,
  attachmentCount,
  completedCount,
  todochecklist,
 onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

 const totalTasks = todochecklist?.length || 0;
  const doneTasks = completedCount || 0;
  const progressPercent = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  const getStatusTagColor = () => {
    switch (status) {
      case "in-progress":
        return "text-cyan-600 bg-cyan-100 border border-cyan-500/10";
      case "completed":
        return "text-lime-600 bg-lime-100 border border-lime-500/20";
      default:
        return "text-violet-600 bg-violet-100 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "low":
        return "text-emerald-600 bg-emerald-50 border border-emerald-500/10";
      case "medium":
        return "text-amber-600 bg-amber-50 border border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer relative">
        {/* Three dot icon */}
        <div className="absolute top-3 right-3">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <BsThreeDotsVertical className="text-gray-600 text-lg" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white rounded shadow z-20">
              <button
                onClick={() => {
                  setMenuOpen(false);
                 onEdit(); 
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowConfirmModal(true); // SHOW MODAL
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-end gap-3 px-4">
            <div
              className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounde`}
            >
              {status}
            </div>
            <div
              className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounde`}
            >
              {priority} Priority
            </div>
          </div>
          <div
            className={`px-4 border-l-[3px] ${
              status === "in-progress"
                ? "border-violet-500"
                : status === "Completed"
                ? "border-indigo-500"
                : "border-violet-500"
            }`}
          >
            <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
              {title}
            </p>
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
              {description}
            </p>
            <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
              Task Done:{" "}
              <span className="font-semibold text-gray-700">
                {completedCount} / {todochecklist.length || 0}
              </span>
            </p>
            {/* <Progress progress={progress} status={status} /> */}
            <Progress progress={progressPercent} status={status} />
          </div>

          <div className="px-4">
            <div className="flex items-center justify-between my-1">
              <div>
                <label className="text-xs text-gray-600">Start Date</label>
                <p className="text-[13px] text-gray-900 font-medium">
                  {moment(createdAt).format("Do MMM YYYY")}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600">Due Date</label>
                <p className="text-[13px] text-gray-900 font-medium">
                  {moment(dueDate).format("Do MMM YYYY")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <AvtarGroup avatars={assignTo || []} />
              {attachmentCount > 0 && (
                <div className="flex items-center gap-2 bg-blue-100 px-2.5 py-1.5 rounded-lg">
                  <LuPaperclip className="text-primary" />
                  <span className="text-xs text-gray-900">
                    {attachmentCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm delete modal */}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/70 bg-opacity-100 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={() => {
                  setShowConfirmModal(false);
                  onDelete(); // call delete prop
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
