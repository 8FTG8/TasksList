const API_URL = 'http://127.0.0.1:8000/tasks';

const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-form-input]');
const list = document.querySelector('[data-list]');
const button = document.querySelector('[data-form-button]');

document.addEventListener('DOMContentLoaded', loadTasks);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();

  if (title) {
    await addTask(title);
    input.value = '';
    await loadTasks();
  }
});

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao carregar tarefas');

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Erro:', error);
    showError('Falha ao carregar tarefas');
  }
}

function renderTasks(tasks) {
  list.innerHTML = '';

  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'container__list__item';
    taskItem.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'container__list__item__checkbox';
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id, checkbox.checked));

    const taskTitle = document.createElement('span');
    taskTitle.textContent = task.title;
    taskTitle.className = task.completed ? 'container__list__item__text completed' : 'container__list__item__text';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
    deleteBtn.className = 'container__list__item__delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskTitle);
    taskItem.appendChild(deleteBtn);

    list.appendChild(taskItem);
  });
}

async function addTask(title) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title })
    });

    if (!response.ok) throw new Error('Falha ao adicionar tarefa');

  } catch (error) {
    console.error('Erro:', error);
    showError('Falha ao adicionar tarefa');
  }
}

async function toggleTaskCompletion(taskId, completed) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed })
    });

    if (!response.ok) throw new Error('Falha ao atualizar tarefa');

    await loadTasks();
  } catch (error) {
    console.error('Erro:', error);
    showError('Falha ao atualizar tarefa');
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Falha ao deletar tarefa');

    await loadTasks();
  } catch (error) {
    console.error('Erro:', error);
    showError('Falha ao deletar tarefa');
  }
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}
