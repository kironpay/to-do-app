const API = 'http://localhost:3000/api/tasks';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const taskInput = document.getElementById('new-task');
  const taskList = document.getElementById('task-list');

  function fetchTasks() {
    fetch(API)
      .then(res => res.json())
      .then(tasks => renderTasks(tasks));
  }

  function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');

      const span = document.createElement('span');
      span.textContent = task.content;
      span.contentEditable = false;

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.onclick = () => {
        if (editBtn.textContent === 'Editar') {
          span.contentEditable = true;
          span.focus();
          editBtn.textContent = 'Guardar';
        } else {
          fetch(`${API}/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: span.textContent.trim() })
          }).then(fetchTasks);
        }
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.onclick = () => {
        fetch(`${API}/${task.id}`, { method: 'DELETE' }).then(fetchTasks);
      };

      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const content = taskInput.value.trim();
    if (content) {
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      }).then(() => {
        taskInput.value = '';
        fetchTasks();
      });
    }
  });

  fetchTasks();
});
