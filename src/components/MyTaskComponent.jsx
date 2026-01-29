import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {
  getAllTasks,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
} from "../services/taskService";
import toast from "react-hot-toast";

const MyTaskComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tasks"),
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Failed to load tasks.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  //   Sustituido para que se recargue la lista de tareas cada vez que se actualicen
  //   useEffect(() => {
  //     fetchTasks();
  //   }, []);
  //   const fetchTasks = async () => {
  //     try {
  //       const tasksData = await getAllTasks();
  //       setTasks(tasksData);
  //     } catch (error) {
  //       toast.error("Failed to load tasks.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
    document.getElementById("update-modal").showModal();
  };
  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    try {
      await updateTaskInFirestore(selectedTask.id, {
        title: updatedTitle,
        description: updatedDescription,
      });
      toast.success("Task updated successfully!");
      //   fetchTasks();
      document.getElementById("update-modal").close();
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };
  const handleDelete = async (taskId) => {
    try {
      await deleteTaskFromFirestore(taskId);
      toast.success("Task deleted successfully!");
      //   fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  return (
    <div>
      {loading && <p className="text-gray-600">Loading tasks...</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-gray-500">No tasks available.</p>
      )}
      {!loading &&
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col gap-2 mt-2 p-3 text-white bg-blue-900 rounded-md shadow-md"
          >
            <h1 className="text-xl font-semibold mb-2">{task.title}</h1>
            <p className="text-sm text-gray-100">{task.description}</p>
            <div className="flex w-full justify-end items-center gap-4 mt-4">
              <button
                className="btn btn-primary text-white flex gap-1 px-6"
                onClick={() => handleEdit(task)}
              >
                <FaRegEdit className="text-base" />
                Edit
              </button>
              <button
                className="btn btn-error bg-red-600 text-white flex gap-1 px-3 hover:bg-red-700 transition ease-in-out"
                onClick={() => handleDelete(task.id)}
              >
                <MdDeleteOutline className="text-lg" />
                Delete
              </button>
            </div>
          </div>
        ))}

      {/* Modal Popup for Update Task (DaisyUI component) */}
      <dialog id="update-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Task</h3>
          <div className="py-4">
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <label className="block text-gray-700 font-medium mt-3">
              Description
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary text-white"
              onClick={handleUpdateTask}
            >
              Save Changes
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("update-modal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyTaskComponent;
