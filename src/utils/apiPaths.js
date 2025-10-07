export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    RAGISTER: "/api/auth/ragister", //POST
    LOGIN: "/api/auth/login", // POST
    GET_PROFILE: "/api/auth/profile", //GET
    UPDATE_PROFIL: "/api/auth/profile", //PUT
    UPLOAD_IMG: "/api/auth/upload-image", //POST
  },
  USERS: {
    GET_USERS: "/api/user/", //GET all user -  ADMIN ONLY
    GET_USER_BY_ID: (userId) => `/api/user/${userId}`, //GET
    CREATE_USER: "/api/users/", // POST ADMIN_ONLY
    UPDATE_USER: (userId) => `/api/user/${userId}`,
    DELETE_USER: (userId) => `/api/user/${userId}`,
  },

  TASKS: {
    GET_TASK_BY_ID: (userId) => `/api/task/${userId}`, //GET
    GET_ALL_TASK: "/api/task/all-tasks", // get all task
    DELETE_TASK: (taskId) => `/api/task/${taskId}`, // delete user admin only
    UPDATE_TASK: (taskId) => `/api/task/${taskId}`, // update task details
    GET_DASHBOARD_DATA: "/api/task/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/task/user-dashboard-data",
    CREATE_TASK: "api/task", //create a new task (admin only)

    UPATE_TASK_STATUS: (taskId) => `/api/task/${taskId}/Status`, // PUT
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/task/${taskId}/todo`,
  },

  REPORT: {
    EXPORT_TASK: "/api/reports/export/tasks",
    EXPORT_USER: "/api/reports/export/users",
    EXPORT_PDFUSER: "/api/report/export-pdf/userpdf",
  },
};
