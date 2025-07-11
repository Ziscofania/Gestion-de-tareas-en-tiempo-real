import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    socket.on('taskAdded', (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on('taskDeleted', (taskId) => {
      setTasks((prev) => prev.filter((_, index) => index !== taskId));
    });

    return () => {
      socket.off('taskAdded');
      socket.off('taskDeleted');
    };
  }, []);

  const handleAddTask = () => {
    if (newTask.trim()) {
      socket.emit('addTask', { text: newTask, completed: false });
      setNewTask('');
    }
  };

  const handleDeleteTask = (index) => {
    socket.emit('deleteTask', index);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tareas en Tiempo Real</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="Nueva tarea"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-2 ml-2"
        >
          Agregar
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-between items-center p-2 border-b">
            {task.text}
            <button
              onClick={() => handleDeleteTask(index)}
              className="text-red-500"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;