import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect } from "react";
import axios from "axios";

let baseURL = "http://localhost:3000/"

function App() {
  const [todos, setTodos] = useState([])
  // fetch all todos from server

  fetchTodos();

  function fetchTodos(){
    axios.get(baseURL + "todos").then((response) => {
      setTodos(response.data);
    });
  }

  function handleDelete(todoId){
    axios.delete(baseURL + `todos/${todoId}`).then();
    fetchTodos();
  };

  function createTodo(event)
  {
    event.preventDefault();
    var title = event.currentTarget.elements.todoFormTitle.value;
    var description = event.currentTarget.elements.todoFormDescription.value;

    axios.post(baseURL + "todos", {
      title: title,
      description: description
    }).then();
  }

  return (
    <>
      <div id="todoApp">
        <div className="row">
          <form onSubmit={createTodo} id="createTodoForm" className="mx-auto my-4 col-6 border p-4">
            <div className="mb-3">
              <label htmlFor="todoFormTitle" className="form-label">Todo Title</label>
              <input type="text" className="form-control" id="todoFormTitle"></input>
            </div>
            <div className="mb-3">
              <label htmlFor="todoFormDescription" className="form-label">Todo Description</label>
              <input type="text" className="form-control" id="todoFormDescription"></input>
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary">Create Todo</button>
            </div>
          </form>
        </div>
        <TodoList todos={todos} handleDelete={handleDelete}></TodoList>
      </div>
    </>
  )
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return <div>
    {props.title}
  </div>
}

function TodoList(props) {
  var todos = props.todos;
  var todoList = todos.map(todo =>
    <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-start">
      <div className="ms-2 me-auto">
        <div className="fw-bold">{todo.title}</div>
        {todo.description}
      </div>
      <button className="btn btn-danger" onClick={() => props.handleDelete(todo.id)}>Delete</button>
    </li>
  );

  return <div className="row">
    <div className="mx-auto my-4 col-8">
      <ol className="list-group list-group-numbered">
        {todoList}
      </ol>
    </div>
  </div>
}

function deleteTodo(id)
{
  this.App.useState(this.App.state);
  
}

export default App
