import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTodoChecklist = async (index) => {
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id), {
        index,
      });
      getTaskDetailsByID();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleLinkClick = (link) => {
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    getDashboardData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const taskStatusData = dashboardData
    ? [
        {
          name: "Pending",
          value: dashboardData.pendingTasks || 0,
          color: "#8884d8",
        },
        {
          name: "In Progress",
          value: dashboardData.inProgressTasks || 0,
          color: "#82ca9d",
        },
        {
          name: "Completed",
          value: dashboardData.completedTasks || 0,
          color: "#ffc658",
        },
      ]
    : [];

  const priorityData = dashboardData
    ? [
        { name: "High", value: dashboardData.highPriorityTasks || 0 },
        { name: "Medium", value: dashboardData.mediumPriorityTasks || 0 },
        { name: "Low", value: dashboardData.lowPriorityTasks || 0 },
      ]
    : [];

  const weeklyData = dashboardData?.weeklyProgress || [
    { day: "Mon", completed: 2, pending: 3 },
    { day: "Tue", completed: 5, pending: 2 },
    { day: "Wed", completed: 3, pending: 4 },
    { day: "Thu", completed: 7, pending: 1 },
    { day: "Fri", completed: 4, pending: 3 },
    { day: "Sat", completed: 2, pending: 1 },
    { day: "Sun", completed: 1, pending: 2 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Task Management Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardData?.totalTasks || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-bold text-green-600">
              {dashboardData?.completedTasks || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
            <p className="text-2xl font-bold text-blue-600">
              {dashboardData?.inProgressTasks || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-orange-600">
              {dashboardData?.pendingTasks || 0}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Task Status Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Task Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>`
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tasks by Priority
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Weekly Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task Details */}
        {task && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Task Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700">Title</h4>
                <p className="text-gray-900">{task.title}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Status</h4>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusTagColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Priority</h4>
                <p className="text-gray-900">{task.priority}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Due Date</h4>
                <p className="text-gray-900">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
              {task.description && (
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-700">Description</h4>
                  <p className="text-gray-900">{task.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTaskDetails;
