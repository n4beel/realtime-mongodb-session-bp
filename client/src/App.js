import { useEffect, useState } from 'react'
import './App.css';
import Pusher from 'pusher-js';

let pusher, channel
const API_URL = 'http://192.168.18.2:9000/api/';

function App() {

  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState('')

  useEffect(() => {
    fetchTasks()
    pusher = new Pusher(process.env.REACT_APP_KEY, {
      cluster: process.env.REACT_APP_CLUSTER,
      useTLS: true,
    });

    channel = pusher.subscribe('tasks');

    channel.bind('inserted', addTask);
    channel.bind('deleted', removeTask);
  }, [])

  useEffect(() => {
    console.log("tasks updated", tasks)
  }, [tasks])

  const fetchTasks = () => {
    fetch(API_URL + 'all')
      .then(res => res.json())
      .then(res => {
        res = res.map(item => ({
          ...item,
          id: item._id
        }))
        setTasks(res)
      })
  }

  const updateText = (e) => {
    setTask(e.target.value)
  }

  const postTask = (e) => {
    e.preventDefault();
    if (!task.length) {
      return;
    }
    const newTask = { task };
    fetch(API_URL + 'new', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
  }

  const deleteTask = (id) => {
    fetch(API_URL + id, {
      method: 'delete'
    })
  }

  const addTask = (newTask) => {
    setTask('')
    fetchTasks()
  }

  const removeTask = (id) => {
    fetchTasks()
  }

  let tasksList = tasks.map(item =>
    <Task key={item.id} task={item} onTaskClick={deleteTask} />
  );

  return (
    <div className="todo-wrapper">
      <form onSubmit={postTask}>
        <input type="text" className="input-todo" placeholder="New task" onChange={updateText} value={task} />
        <button className="btn btn-add">+</button>
      </form>

      <ul>
        {tasksList}
      </ul>
    </div>
  );
}

function Task(props) {
  const onClick = () => {
    props.onTaskClick(props.task.id);
  }
  return (
    <li key={props.task.id}>
      <div className="text">{props.task.task}</div>
      <div className="delete" onClick={onClick}>-</div>
    </li>
  );
}

export default App;
