import React, { useState, useEffect } from "react";
import axios from "axios";

const EditTaskModal = ({ isOpen, closeModal, task, fetchTasks }) => {
  const [updatedTask, setUpdatedTask] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
  });

  useEffect(() => {
    if (task) {
      setUpdatedTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setUpdatedTask({
      ...updatedTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5100/api/tasks/${task.id}`,
        updatedTask
      );
      fetchTasks();
      closeModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={updatedTask.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={updatedTask.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={updatedTask.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={updatedTask.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button"  className="cancel-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;