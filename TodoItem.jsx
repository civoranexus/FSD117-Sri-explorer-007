import React from 'react';

const TodoItem = ({ todo, toggleComplete, deleteTodo }) => {
    return (
        <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label className="todo-label">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
            </label>
            <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
                aria-label="Delete todo"
            >
                ×
            </button>
        </li>
    );
};

export default TodoItem;
