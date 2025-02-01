import React, { useState, useEffect } from "react";

const StudyTracker = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskName, setTaskName] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [sortOption, setSortOption] = useState("priority");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskName.trim() === "") return;
    setTasks([
      ...tasks,
      {
        name: taskName,
        notes: taskNotes,
        dueDate: taskDueDate,
        priority: taskPriority,
        timeSpent: 0,
        completed: false,
        timer: null,
      },
    ]);
    setTaskName("");
    setTaskNotes("");
    setTaskDueDate("");
    setTaskPriority("Medium");
  };

  const toggleComplete = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index - 1 ? { ...task, completed: !task.completed } : task
      )
    );
  };
  

  const startTimer = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index
          ? { ...task, timer: setInterval(() => updateTime(i), 1000) }
          : task
      )
    );
  };

  const stopTimer = (index) => {
    clearInterval(tasks[index].timer);
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, timer: null } : task
      )
    );
  };

  const updateTime = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, timeSpent: task.timeSpent + 1 } : task
      )
    );
  };

  const deleteTask = (index) => {
    setTaskToDelete(index);
    setConfirmDialogVisible(true);
  };

  const confirmDelete = () => {
    setTasks(tasks.filter((_, i) => i !== taskToDelete));
    setConfirmDialogVisible(false);
  };

  const cancelDelete = () => {
    setConfirmDialogVisible(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredTasks = tasks
    .filter((task) => task.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((task) => {
      if (selectedFilter === "completed") return task.completed;
      if (selectedFilter === "pending") return !task.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "priority") {
        return a.priority.localeCompare(b.priority);
      } else if (sortOption === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  return (
    <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-lg shadow-lg w-screen p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Study Tracker</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search tasks..."
        className="border p-3 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter study task"
        />
        <textarea
          value={taskNotes}
          onChange={(e) => setTaskNotes(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add notes"
        ></textarea>
        <input
          type="date"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Task Priority */}
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          onClick={addTask}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-3 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition duration-300"
        >
          Add Task
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="mb-6">
        <label className="text-gray-600 mr-2">Sort by: </label>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <label className="text-gray-600 mr-2">Filter by: </label>
        <select
          value={selectedFilter}
          onChange={handleFilterChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Task List with sorting */}
      <div className="space-y-6">
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            className={`p-5 bg-white rounded-lg shadow-md flex flex-col gap-4 ${
              task.completed ? "bg-gray-200" : "bg-gradient-to-r from-green-50 to-blue-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-lg font-semibold ${
                  task.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {task.name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleComplete(index)}
                  className={`py-1 px-4 rounded-lg ${
                    task.completed ? "bg-gray-400 text-black" : "bg-green-500 text-black"
                  } hover:bg-opacity-80 transition`}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="bg-red-500 text-black py-1 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
            {task.notes && <p className="text-gray-600">{task.notes}</p>}
            {task.dueDate && <p className="text-gray-600">Due: {task.dueDate}</p>}
            <p className="text-gray-600">Priority: {task.priority}</p>
            <p className="text-gray-600">Time Spent: {task.timeSpent} sec</p>
            <div className="flex gap-3">
              {!task.timer ? (
                <button
                  onClick={() => startTimer(index)}
                  className="bg-blue-500 text-black py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={() => stopTimer(index)}
                  className="bg-red-500 text-black py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  Stop
                </button>
              )}
            </div>
            {task.completed && (
              <span className="bg-green-500 text-white py-1 px-2 rounded-lg text-sm mt-2">Completed</span>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {isConfirmDialogVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this task?</h3>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="bg-green-500 text-black py-2 px-4 rounded-lg hover:bg-green-600 transition border border-green-400"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="bg-red-500 text-black py-2 px-4 rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTracker;
