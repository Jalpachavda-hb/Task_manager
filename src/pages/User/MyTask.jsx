import React, { useEffect, useState } from "react";
import DashboardLayout from "../../cmponents/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import TaskStatusTabs from "../../cmponents/layouts/TaskStatusTabs";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskCard from "../../cmponents/layouts/Cards/TaskCard";
import { PiFilePdfDuotone } from "react-icons/pi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // ✅ Fetch all tasks
  const getAllTasks = async () => {
    try {
      const response = await axiosinstance.get(API_PATHS.TASKS.GET_ALL_TASK);
      const tasks = response.data?.tasks || [];
      setAllTasks(tasks);

      // Build dynamic status tabs
      const statusArry = [
        { label: "All", count: tasks.length },
        {
          label: "Pending",
          count: tasks.filter((t) => t.status?.toLowerCase() === "pending")
            .length,
        },
        {
          label: "in-progress",
          count: tasks.filter((t) => t.status === "in-progress").length,
        },
        {
          label: "Completed",
          count: tasks.filter((t) => t.status?.toLowerCase() === "completed")
            .length,
        },
      ];
      setTabs(statusArry);
      setTasks(tasks); 
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  // ✅ Fetch all users
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

  // ✅ Handle delete task
  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await axiosinstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully");
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setAllTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  // ✅ Navigate to edit
  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  // ✅ Download PDF
  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("Task Report", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    const headers = [
      [
        "Title",
        "Description",
        "Status",
        "Assigned To",
        "Assigned By",
        "Priority",
        "Due Date",
        "Created At",
      ],
    ];

    const tableRows = allTasks.map((task) => {
      const assignedToNames =
        task.assignedTo
          ?.map((user) => {
            const fullUser = allUsers.find((u) => u._id === user._id);
            return fullUser ? fullUser.name : "Unknown";
          })
          .join(", ") || "N/A";

      const assignedBy = task?.createdBy?.name || "Unknown";

      return [
        task.title || "",
        task.description || "",
        task.status || "",
        assignedToNames,
        assignedBy,
        task.priority || "",
        new Date(task.dueDate).toLocaleDateString() || "",
        new Date(task.createdAt).toLocaleDateString() || "",
      ];
    });

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [219, 234, 254],
        textColor: [30, 64, 175],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        textColor: [0, 0, 0],
        fontSize: 9,
      },
      styles: { lineColor: [200, 200, 200], lineWidth: 0.3 },
      margin: { left: 14, right: 14 },
    });

    doc.save("task_report.pdf");
  };

  // ✅ Fetch on mount
  useEffect(() => {
    getAllTasks();
  }, []);

  // ✅ Filter tasks on status change
  useEffect(() => {
    const filtered =
      filterStatus === "All"
        ? allTasks
        : allTasks.filter(
            (t) =>
              t.status?.toLowerCase() ===
              filterStatus.toLowerCase().replace(" ", "")
          );

    setTasks(filtered);
  }, [filterStatus, allTasks]);

  // ✅ Render
  return (
    <DashboardLayout activeMenu="My Task">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium">My Tasks</h2>
            <button
              className="lg:hidden flex items-center gap-3 text-xs md:text-sm text-lime-900 bg-lime-100 px-3 py-2 rounded border border-lime-200 hover:border-lime-400 cursor-pointer"
              onClick={handleDownloadPdf}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs?.length > 0 && (
            <div className="flex items-center gap-3 mt-3 lg:mt-0">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button
                className="hidden lg:flex items-center gap-3 text-xs md:text-sm text-lime-900 bg-lime-100 px-3 py-2 rounded border border-lime-200 hover:border-lime-400 cursor-pointer"
                onClick={handleDownloadPdf}
              >
                <PiFilePdfDuotone className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress}
                createdAt={task.createdAt}
                dueDate={task.dueDate}
                assignTo={task.assignedTo?.map((user) => {
                  const fullUser = allUsers.find((u) => u._id === user._id);
                  return fullUser?.ProfileImageUrl || "/default-avatar.png";
                })}
                attachmentCount={task.attechments?.length || 0}
                completedCount={task.completedCount || 0}
                todochecklist={task.todochecklist || []}
                onEdit={() => handleClick(task)}
                onDelete={() => handleDelete(task._id)}
              />
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500 mt-10">
              No tasks found for this status.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTask;
