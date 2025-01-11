import React, { useEffect, useState } from "react";
import api from "../services/api";
import './ActivityLogModal.css';

const ActivityLogModal = ({ isOpen, closeModal, taskDetails }) => {
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    if (taskDetails && isOpen) {
      api
        .get(`/tasks/${taskDetails.id}/logs`)
        .then((response) => setActivityLogs(response.data))
        .catch((error) => console.error("Error fetching activity logs:", error));
    }
  }, [taskDetails, isOpen]);

  return isOpen ? (
    <div className="activity-log-modal">
      <div className="modal-content">
        <h2>Activity Log</h2>
        <button className="close-btn" onClick={closeModal}>X</button>

        <div className="task-details">
          <p><strong>Task Name:</strong> {taskDetails?.name || "N/A"}</p>
          <p><strong>Description:</strong> {taskDetails?.description || "N/A"}</p>
          <p><strong>Assigned User:</strong> {taskDetails?.assignedUser || "N/A"}</p>
        </div>

        <div className="activity-log-table-container">
          {activityLogs.length > 0 ? (
            <table className="activity-log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Updated By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No activity logs available for this task.</p>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default ActivityLogModal;