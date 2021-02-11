
import './App.css';
import { useState, useEffect } from 'react';

const URL = 'http://localhost:8888/todo/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    let status = 0;
    fetch(URL + 'index.php')
      .then(res => {
        status = parseInt(res.status);
        return res.json()
      })
      .then(
        (res) => {
          if (status === 200) {
            setTasks(res);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
  }, [])


  function save(e) {
    e.preventDefault(); // Prevent form submission.
    let status = 0; // Define a variable for http status (response from server).
    fetch(URL + 'add.php', { // Send HTTP post to server and send new task description.
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ // Pass parameter for POST request here.
        description: task
      })
    })
    .then(res => { // Sava http response status code and return json from response (so next then statement is receiving data).
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) { // If status is ok, update UI.
          setTasks(tasks => [...tasks, res]);
          setTask('');
        } else { // If status code is not ok, there is an error, display error message defined in server.
          alert(res.error);
        }
      }, (error) => { // Catch network errors.
        alert(error);
      }
    )
  }

  function remove(id) {
    let status = 0; 
    fetch(URL + 'delete.php', { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ 
        id: id
      })
    })
    .then(res => { 
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) { 
          const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
          setTasks(newListWithoutRemoved);
        } else { 
          alert(res.error);
        }
      }, (error) => { 
        alert(error);
      }
    )
  }

  return (
    <div className="container">
      <h3>Todo list</h3>
      <div>
        <form onSubmit={save}>
          <label>New task</label>
          <input value={task} onChange={e => setTask(e.target.value)} />
          <button>Save</button>
        </form>
      </div>
      <ol>
        {tasks.map(task => (
          <li key={task.id}>{task.description}<a className="delete" onClick={() => remove(task.id)} href="#">Delete</a></li>
        ))}
      </ol>
    </div>
  );
}

export default App;
