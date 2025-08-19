import React, { useState, useEffect } from "react";
import DashboardLayout from "../../cmponents/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosinstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectPriority from "../../cmponents/SelectPriority";
import SelectUsers from "../../cmponents/SelectUsers";
import TodoListinput from "../../cmponents/TodoListinput";
import AddAttachment from "../../cmponents/AddAttechment";
import { Toaster, toast } from "react-hot-toast";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attechments: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [key]: null }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attechments: [],
    });
    setErrors({});
  };
  useEffect(() => {
    if (taskId) {
      fetchTaskById(taskId);
    }
  }, [taskId]);
  const handleDelete = async () => {
    try {
      await axiosinstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully!");
      navigate("/admin/tasks"); // go back after delete
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete task.");
    }
  };
  const fetchTaskById = async (id) => {
    try {
      const response = await axiosinstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );
      const data = response.data;

      setTaskData({
        title: data.title || "",
        description: data.description || "",
        priority: data.priority || "low",
        dueDate: data.dueDate ? moment(data.dueDate).format("YYYY-MM-DD") : "",
        assignedTo: (data.assignedTo || []).map((u) => u._id),
        todoChecklist: (data.todochecklist || []).map((item) => ({
          text: item.title || "", // <-- convert title to text
          completed: item.completed || false,
          _id: item._id, // keep _id if needed
        })),
        attechments: (data.attechments || []).map((a) =>
          typeof a === "string" ? { url: a } : { url: a?.url || "" }
        ),
      });
    } catch (err) {
      toast.error("Failed to load task");
      console.error("Error fetching task:", err);
    }
  };
  const updateTask = async () => {
    try {
      const todolist = taskData.todoChecklist.map((item) =>
        typeof item === "string"
          ? { title: item, completed: false }
          : {
              title: item?.title || item?.text || "",
              completed: item?.completed || false,
            }
      );

      const payload = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: new Date(taskData.dueDate).toISOString(),
        assignedTo: taskData.assignedTo,
        todochecklist: todolist,
        attechments: taskData.attechments.map((a) =>
          typeof a === "string" ? a : a?.url || ""
        ),
      };

      await axiosinstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), payload);

      toast.success("Task updated successfully!");
      navigate("/admin/tasks");
    } catch (err) {
      toast.error("Update failed");
      console.error("Update error:", err.response?.data || err.message || err);
    }
  };
  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist.map((item) =>
        typeof item === "string"
          ? { title: item, completed: false }
          : {
              title: item?.title || item?.text || "",
              completed: item?.completed || false,
            }
      );

      const payload = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: new Date(taskData.dueDate).toISOString(),
        assignedTo: taskData.assignedTo,
        todochecklist: todolist,
        attechments: taskData.attechments.map((a) =>
          typeof a === "string" ? a : a?.url || ""
        ),
      };

      console.log("Sending payload:", payload);

      await axiosinstance.post(API_PATHS.TASKS.CREATE_TASK, payload);

      toast.success("Task created successfully");
      clearData();
      navigate("/admin/create-task");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!taskData.title.trim()) newErrors.title = "Title is required";
    if (!taskData.description.trim())
      newErrors.description = "Description is required";
    if (!taskData.dueDate?.trim()) newErrors.dueDate = "Due Date is required";
    if (!taskData.assignedTo.length)
      newErrors.assignedTo = "Assign the task to at least one member";
    if (!taskData.todoChecklist.length)
      newErrors.todoChecklist = "Enter at least one todo task";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (taskId) {
      await updateTask();
    } else {
      await createTask();
    }
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <Toaster />
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3 max-w-3xl w-full p-5 bg-white shadow-md rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setShowConfirmModal(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            {/* Title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Task Title"
                className="form-input w-full mt-1"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Description
              </label>
              <textarea
                placeholder="Describe the Task"
                className="form-input w-full mt-1"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Priority, Date, Assign */}
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectPriority
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate || ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                />
                {errors.dueDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
                )}
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
                {errors.assignedTo && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.assignedTo}
                  </p>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO CheckList
              </label>
              <TodoListinput
                todoList={taskData.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
              {errors.todoChecklist && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.todoChecklist}
                </p>
              )}
            </div>

            {/* Attachments */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachment
              </label>
              <AddAttachment
                attechments={taskData.attechments}
                setAttachments={(value) =>
                  handleValueChange("attechments", value)
                }
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
            {showConfirmModal && (
              <div className="fixed inset-0 z-50 bg-black/70 bg-opacity-100 flex justify-center items-center">
                <div className="bg-white w-[90%] max-w-sm p-5 rounded-xl shadow-xl">
                  <h2 className="text-lg font-semibold mb-4 text-center">
                    Are you sure you want to delete this task?
                  </h2>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-600 rounded"
                      onClick={handleDelete}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
