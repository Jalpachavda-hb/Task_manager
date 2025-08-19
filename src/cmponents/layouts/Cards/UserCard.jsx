import React from "react";

const UserCard = ({ userInfo }) => {
  if (!userInfo) return null; // Optional: prevent rendering if no userInfo

  return (
    <div className="user-card p-4 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.ProfileImageUrl || "/default-avatar.png"}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {userInfo?.name}
            </p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasksCount || 0}
          status="pending"
        />
         <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasksCount || 0}
          status="in-progress"
        />
         <StatCard
          label="Completed"
          count={userInfo?.completedTasksCount || 0}
          status="completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ status, label, count }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "in-progress":
        return "text-cyan-500 bg-gray-50";
      case "completed":
        return "text-indigo-500 bg-gray-50";
      default:
        return "text-violet-500 bg-gray-50";
    }
  };

  return (
    <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
      <span className="text-[12px] font-semibold">{count}</span>
      <br />
      {label}
    </div>
  );
};