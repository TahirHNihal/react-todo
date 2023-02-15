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
      completedTask: [],
      pendingTask: [],
      showStatusTodos: "all",
    };
  }
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
              status: "",
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
  //
  handleAllTaskList = () => {
    this.state.showStatusTodos = "all";
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
    this.componentDidMount();
  };
  //Handle Complete Task List
  handleComepleteTaskList = () => {
    console.log(this.state.showStatusTodos);
    this.state.showStatusTodos = "completed";
    console.log(this.state.showStatusTodos);
    axios
      .get("http://localhost:5050/todos/")
      .then((res) => {
        this.setState((prevState) => ({
          ...prevState,
          completedTask: [
            ...prevState.todos.filter((data) => data.status === "completed"),
          ],
        }));
      })
      .catch((err) => {
        console.log(err.message);
      });
    this.componentDidMount();
  };
  //Handle Pending Task List
  handlePendingTaskList = () => {
    this.state.showStatusTodos = "pending";
    console.log(this.state.showStatusTodos);
    axios
      .get("http://localhost:5050/todos/")
      .then((res) => {
        this.setState((prevState) => ({
          ...prevState,
          pendingTask: [
            ...prevState.todos.filter((data) => data.status === "pending"),
          ],
        }));
      })
      .catch((err) => {
        console.log(err.message);
      });
    this.componentDidMount();
  };

  render() {
    const { todos, input, completedTask, pendingTask } = this.state;
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
                      <button onClick={this.handleAllTaskList}>All</button>
                    </li>
                    <li>
                      <button onClick={this.handlePendingTaskList}>
                        pending
                      </button>
                    </li>
                    <li>
                      <button onClick={this.handleComepleteTaskList}>
                        Complete
                      </button>
                    </li>
                  </ul>
                  <hr className="divider" />
                </div>
                <>
                  <div className="todo-task-list">
                    <ul>
                      {this.showStatusTodos === "all" ? console.log(true) : console.log(false)}

                      {todos &&
                        todos.map((item, index) => {
                          let textThrough = "none";
                          if (item.status === "completed") {
                            textThrough = "line-through";
                          } else {
                            textThrough = "none";
                          }

                          return (
                            <li key={index}>
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
                  <h5>Complete</h5>
                  <hr className="divider" />
                  <div className="todo-task-list">
                    <ul>
                      {completedTask &&
                        completedTask.map((item, index) => {
                          let textThrough = "none";
                          if (item.status === "completed") {
                            textThrough = "line-through";
                          } else {
                            textThrough = "none";
                          }

                          return (
                            <li key={index}>
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
                  <h5>Pending</h5>
                  <hr className="divider" />
                  <div className="todo-task-list">
                    <ul>
                      {pendingTask &&
                        pendingTask.map((item, index) => {
                          // let textThrough = "none";
                          // if (item.status === "completed") {
                          //   textThrough = "line-through";
                          // } else {
                          //   textThrough = "none";
                          // }
                          return (
                            <li key={index}>
                              <div className="tasklist-wrapper">
                                <div className="task-name">
                                  <button
                                    onClick={() => this.handleComplete(item.id)}
                                  >
                                    <i class="bx bx-check"></i>
                                  </button>
                                  <h4>{item.task}</h4>
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
                </>
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
