import React, { useState } from "react";
import axios from "axios";
import './CreateTaskModal.css';

const CreateTaskModal = ({ isOpen, closeModal, fetchTasks }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: "",
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.assignedTo) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const { title, description, priority, dueDate, assignedTo } = newTask;
      const taskData = { title, description, priority, dueDate, assignedTo };

      await axios.post("http://localhost:5100/api/tasks", taskData);
      fetchTasks();
      closeModal();
    } catch (error) {
      console.error("Error creating task:", error);
      setError("There was an error creating the task.");
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>
          &times;
        </button>

        <h2>Create New Task</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              required
            />
          </div>
          {/* <div className="form-group">
            <input
              type="text"
              placeholder="Assigned To"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              required
            />
          </div> */}
          <div className="form-actions">
            <button type="submit" className="save-btn">Create Task</button>
            <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;