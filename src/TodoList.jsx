import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;

    const newTask = {
      id: uuidv4(),
      text: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "incomplete":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  const sortedTasks = () => {
    const tasksToSort = filteredTasks();
    switch (sort) {
      case "alphabetical":
        return [...tasksToSort].sort((a, b) => a.text.localeCompare(b.text));
      case "completed":
        return [...tasksToSort].sort((a, b) => b.completed - a.completed);
      default:
        return tasksToSort;
    }
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <form className="todo-form" onSubmit={addTask}>
        <input
          type="text"
          value={task}
          onChange={handleTaskChange}
          placeholder="Enter a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <div className="filter-sort-container">
        <div>
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
        <div>
          <label>Sort: </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="completed">By Completion</option>
          </select>
        </div>
      </div>
      <ul className="todo-list">
        {sortedTasks().map((task) => (
          <li
            key={task.id}
            className={`todo-item ${task.completed ? "completed" : ""}`}
          >
            {task.text}
            <div>
              <button
                className="complete-btn"
                onClick={() => toggleTaskCompletion(task.id)}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                className="remove-btn"
                onClick={() => removeTask(task.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
