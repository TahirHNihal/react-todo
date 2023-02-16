import axios from "axios";
import React, { Component } from "react";
import swal from "sweetalert";
import CButton from "../../components/Button/CButton";
import "./TodoApp.scss";

export class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      input: {
        task: "",
        status: "pending",
      },
      showStatusTodos: "",
    };
  }
  //Handle Input Change
  handleInputChange = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      input: {
        ...prevState.input,
        [e.target.name]: e.target.value,
      },
    }));
  };

  //handleForm
  handleForm = (e) => {
    e.preventDefault();
    if (!this.state.input.task) {
      swal("Add task before submiting");
    } else {
      axios
        .post("http://localhost:5050/todos", this.state.input)
        .then((res) => {
          this.setState((prevState) => ({
            ...prevState,
            todos: [...prevState.todos, this.state.input],
            input: {
              task: "",
              status: "pending",
            },
          }));
        })
        .catch((err) => {
          console.log(err.message);
        });
      this.componentDidMount();
    }
  };

  //Handle Delete Task
  handleDeleteTask = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`http://localhost:5050/todos/${id}`)
          .then((res) => {
            this.setState((prevState) => ({
              ...prevState,
              todos: [...prevState.todos.filter((data) => data.id !== id)],
            }));
          })
          .catch((err) => {
            console.log(err.message);
          });
        swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  //handleComplete
  handleComplete = (id) => {
    axios.get(`http://localhost:5050/todos/${id}`).then((res) => {
      try {
        axios.put(`http://localhost:5050/todos/${id}`, {
          ...res.data,
          status: "completed",
        });
      } catch (error) {
        console.log(error.message);
      }
    });

    this.componentDidMount();
  };
  //Component Did mount
  componentDidMount = () => {
    axios
      .get("http://localhost:5050/todos")
      .then((res) => {
        this.setState((prevState) => ({
          ...prevState,
          todos: [...res.data],
        }));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Handle Pending Task List
  handleStatusChangeBtn = (e) => {
    console.log(e.target.value);
    this.handleTodoByStatus(e.target.value);
  };

  //Handle Todos By Status
  handleTodoByStatus = (showStatusTodos) => {
    if (showStatusTodos === "completed") {
      axios
        .get("http://localhost:5050/todos?status=completed")
        .then((res) => {
          this.setState((prevState) => ({
            ...prevState,
            todos: [...res.data],
          }));
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (showStatusTodos === "pending") {
      axios
        .get("http://localhost:5050/todos?status=pending")
        .then((res) => {
          this.setState((prevState) => ({
            ...prevState,
            todos: [...res.data],
          }));
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      axios
        .get("http://localhost:5050/todos")
        .then((res) => {
          this.setState((prevState) => ({
            ...prevState,
            todos: [...res.data],
          }));
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  render() {
    const { todos, input } = this.state;
    return (
      <>
        <div className="todo-app-wrapper">
          <div className="container">
            <div className="todo-app">
              <h2>My Task List</h2>
              <div className="todo-form-wrapper">
                <div className="todo-add-form">
                  <form onSubmit={this.handleForm}>
                    <div className="input-gap">
                      <input
                        type="text"
                        placeholder="Add your task"
                        name="task"
                        onChange={this.handleInputChange}
                        value={input.title}
                      />
                    </div>
                    <div className="input-gap">
                      <button>
                        <i class="bx bx-plus"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="todo-task-show">
                <div className="todo-task-menu">
                  <ul>
                    <li>
                      <button onClick={this.handleStatusChangeBtn} value="all">
                        All
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={this.handleStatusChangeBtn}
                        value="pending"
                      >
                        pending
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={this.handleStatusChangeBtn}
                        value="completed"
                      >
                        Complete
                      </button>
                    </li>
                  </ul>
                  <hr className="divider" />
                </div>
                <div className="todo-task-list">
                  <ul>
                    {todos &&
                      todos.map((item, index) => {
                        let textThrough = "none";
                        if (item.status === "completed") {
                          textThrough = "line-through";
                        } else {
                          textThrough = "none";
                        }

                        return (
                          <li
                            handleTodoByStatus={this.handleTodoByStatus}
                            key={index}
                          >
                            <div className="tasklist-wrapper">
                              <div className="task-name">
                                <button
                                  onClick={() => this.handleComplete(item.id)}
                                >
                                  <i class="bx bx-check"></i>
                                </button>
                                <h4 style={{ textDecoration: textThrough }}>
                                  {item.task}
                                </h4>
                              </div>
                              <div className="task-action">
                                <ul>
                                  <li>
                                    <button>
                                      <i class="bx bxs-edit-alt"></i>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() =>
                                        this.handleDeleteTask(item.id)
                                      }
                                    >
                                      <i class="bx bxs-trash-alt"></i>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        ;
      </>
    );
  }
}

export default TodoApp;
