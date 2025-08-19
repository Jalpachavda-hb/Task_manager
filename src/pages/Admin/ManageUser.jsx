import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useUserAuth } from "../../hooks/useUserAuth";
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
const ManageUser = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const getAllTasks = async () => {
    try {
      const response = await axiosinstance.get(API_PATHS.TASKS.GET_ALL_TASK);
      const tasks = response.data?.tasks || [];

      setAllTasks(tasks); // store all tasks for filtering

      const statusArry = [
        { label: "All", count: tasks.length },
        {
          label: "Pending",
          count: tasks.filter((t) => t.status === "pending").length,
        },
        {
          label: "In Progress",
          count: tasks.filter((t) => t.status === "inProgress").length,
        },
        {
          label: "Completed",
          count: tasks.filter((t) => t.status === "completed").length,
        },
      ];
      setTabs(statusArry);

      // Set visible tasks based on filter
      const filtered =
        filterStatus === "All"
          ? tasks
          : tasks.filter(
              (t) => t.status === filterStatus.toLowerCase().replace(" ", "")
            );

      setTasks(filtered);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

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

  const handleDelete = async (taskId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirm) return;

    try {
      await axiosinstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully");

      // ⬇️ Remove the task from local state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Title: Tailwind equivalent of text-2xl font-bold text-blue-600 text-center
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // Tailwind text-blue-600
    doc.text("Task Report", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    // Table headers
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

    const tableRows = [];

    allTasks.forEach((task) => {
      const assignedToNames =
        task.assignedTo
          ?.map((user) => {
            const fullUser = allUsers.find((u) => u._id === user._id);
            return fullUser ? fullUser.name : "Unknown";
          })
          .join(", ") || "N/A";

      // const assignedByUser = allUsers.find((u) => u._id === task?.createdBy);
      // const assignedBy = assignedByUser ? createdBy.name : "Unknown";
const assignedBy = task?.createdBy?.name || "Unknown";
      const row = [
        task.title || "",
        task.description || "",
        task.status || "",
        assignedToNames,
        assignedBy,
        task.priority || "",
        new Date(task.dueDate).toLocaleDateString("") || "",
        new Date(task.createdAt).toLocaleDateString() || "",
      ];

      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [219, 234, 254], // Tailwind bg-blue-100
        textColor: [30, 64, 175], // Tailwind text-blue-700
        fontStyle: "bold",
        halign: "center",
        font: "helvetica",
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        textColor: [0, 0, 0],
        font: "helvetica",
        fontSize: 9,
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      margin: { left: 14, right: 14 },
    });

    doc.save("task_report.pdf");
  };

  // useEffect(() => {
  //   getAllTasks();
  //   getAllUsers();
  // }, [filterStatus]);
  useEffect(() => {
  const filtered =
    filterStatus === "All"
      ? allTasks
      : allTasks.filter(
          (t) => t.status === filterStatus.toLowerCase().replace(" ", "")
        );
  setTasks(filtered);
}, [filterStatus, allTasks]);

  useEffect(() => {
    const filtered =
      filterStatus === "All"
        ? allTasks
        : allTasks.filter(
            (t) => t.status === filterStatus.toLowerCase().replace(" ", "")
          );

    setTasks(filtered);
  }, [filterStatus, allTasks]);
  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
            <button
              className="lg:hidden flex download-btn items-center gap-3 text-xs md:text-[13px] text-lime-900 bg-lime-100 px:2 md:px-3 py-2 rounded border border-lime-200  hover:border-lime-400 cursor-pointer"
              onClick={handleDownloadPdf}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>
          {tabs?.length > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button
                className="hidden lg:flex  items-center gap-3 text-xs md:text-[13px] text-lime-900 bg-lime-100 px:2 md:px-3 py-2 rounded border border-lime-200  hover:border-lime-400 cursor-pointer"
                onClick={handleDownloadPdf}
              >
                <PiFilePdfDuotone className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>
        <div className="grid gap-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks.map((task) => (
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
              attachmentCount={task.attechments?.length || 8}
              completedCount={task.completedCount || 0}
              todochecklist={task.todochecklist || []}
              onEdit={() => handleClick(task)}
              onDelete={() => handleDelete(task._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUser;
