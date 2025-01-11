import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import api from "../services/api";
import ActivityLogModal from "./ActivityLogModal";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const role = localStorage.getItem("role");
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [activityLogModalOpen, setActivityLogModalOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [filters, setFilters] = useState({
    priority: "",
    user: "",
    dueDate: "",
  });

  useEffect(() => {
    api
      .get("/tasks")
      .then((response) => setTasks(response.data.data))
      .catch((error) => console.error("Error fetching tasks:", error));

    api
      .get("/users")
      .then((response) => setUsers(response.data.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);
  const filteredTasks = tasks?.filter((task) => {
    return (
      (filters.priority ? task.priority === filters.priority : true) &&
      (filters.user
        ? Number(task.assignedTo) === Number(filters.user)
        : true) &&
      (filters.dueDate ? task.dueDate === filters.dueDate : true)
    );
  }) || [];

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleFileUpload = async (taskId) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(`/tasks/${taskId}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTasks(
        tasks.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleTaskAssign = async (taskId, userId) => {
    try {
      const response = await api.post(`/tasks/${taskId}/assign`, { userId });
      setTasks(
        tasks.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const openActivityLogModal = (taskDetails) => {
    setSelectedTaskDetails(taskDetails);
    setActivityLogModalOpen(true);
  };

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <button onClick={() => setIsModalOpen(true)}>Create Task</button>

      <div className="filter-section">
        <select
          name="priority"
          onChange={handleFilterChange}
          value={filters.priority}
        >
          <option value="">Filter by Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {role === "admin" && (
          <select
            name="user"
            onChange={handleFilterChange}
            value={filters.user}
          >
            <option value="">Filter by User</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        )}
        <input
          type="date"
          name="dueDate"
          value={filters.dueDate}
          onChange={handleFilterChange}
        />
        <button
          onClick={() => setFilters({ priority: "", user: "", dueDate: "" })}
        >
          Clear Filter
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length > 0 ? (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>File</th>
                {role === "admin" && (
                  <>
                    <th>Assigned To</th>
                    <th>Assign</th>
                    <th>Upload</th>
                  </>
                )}
                <th>Actions</th>
                {role === "admin" && <th>Activity Log</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.priority}</td>
                  <td>{task.dueDate}</td>
                  <td>
                    {task.file && (
                      <a
                        href={`http://localhost:5100/api/tasks/${task.id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download File
                      </a>
                    )}
                  </td>
                  {role === "admin" && (
                    <>
                      <td>
                        {users?.find(({ id }) => task.assignedTo === id)?.username ||
                          "Not Assigned"}
                      </td>
                      {/* <td>{task.assignedUser || "Not Assigned"}</td> */}

                      <td>
                        {users?.find(({ id }) => task.assignedTo === id)?.username || (
                          <select
                            onChange={(e) =>
                              handleTaskAssign(task.id, e.target.value)
                            }
                          >
                            <option value="">Assign to User</option>
                            {users?.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.username}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td>
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button onClick={() => handleFileUpload(task.id)}>
                          Upload File
                        </button>
                      </td>
                    </>
                  )}
                  <td>
                    <button
                      className="edit"
                      onClick={() => openEditModal(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                  {role === "admin" && (
                    <td>
                      <button onClick={() => openActivityLogModal(task)}>
                        View Activity Log
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks available.</p>
        )}
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        fetchTasks={fetchTasks}
      />

      {taskToEdit && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          task={taskToEdit}
          fetchTasks={fetchTasks}
        />
      )}

      <ActivityLogModal
        isOpen={activityLogModalOpen}
        closeModal={() => setActivityLogModalOpen(false)}
        taskDetails={selectedTaskDetails}
      />
    </div>
  );
};

export default AdminDashboard;
