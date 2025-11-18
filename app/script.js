const API_BASE = 'http://localhost:3000';

const btnCategories    = document.getElementById('btnCategories');
const btnRandomJoke    = document.getElementById('btnRandomJoke');
const categoriesList   = document.getElementById('categoriesList');
const categorySelect   = document.getElementById('categorySelect');

const jokeCategoryEl   = document.getElementById('jokeCategory');
const jokeTextEl       = document.getElementById('jokeText');
const jokeResponseEl   = document.getElementById('jokeResponse');

const addForm          = document.getElementById('addForm');
const addCategorySelect= document.getElementById('addCategory');
const addJokeInput     = document.getElementById('addJoke');
const addResponseInput = document.getElementById('addResponse');
const addStatusEl      = document.getElementById('addStatus');

const btnStats = document.getElementById('btnStats');
const statsTableBody = document.querySelector('#statsTable tbody');

let categories = [];

btnCategories.addEventListener('click', async () => {
  try {
    const res = await fetch(`${API_BASE}/jokebook/categories`);
    if (!res.ok) {
      console.error('Błąd HTTP przy pobieraniu kategorii:', res.status);
      return;
    }

    const data = await res.json();
    categories = data;

    categoriesList.innerHTML = '';
    categorySelect.innerHTML = '<option value="">-- wybierz kategorię --</option>';

    data.forEach(cat => {
      const li = document.createElement('li');
      li.textContent = cat;
      categoriesList.appendChild(li);

      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
});

// Losowy żart z wybranej kategorii
btnRandomJoke.addEventListener('click', async () => {
  const selectedCategory = categorySelect.value;

  if (!selectedCategory) {
    alert('Najpierw wybierz kategorię.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/jokebook/joke/${selectedCategory}`);
    if (!res.ok) {
      console.error('Błąd HTTP przy pobieraniu żartu:', res.status);
      jokeCategoryEl.textContent = selectedCategory;
      jokeTextEl.textContent = 'Błąd pobierania żartu';
      jokeResponseEl.textContent = '-';
      return;
    }

    const joke = await res.json();

    if (joke.error) {
      jokeCategoryEl.textContent = selectedCategory;
      jokeTextEl.textContent = joke.error;
      jokeResponseEl.textContent = '-';
      return;
    }

    jokeCategoryEl.textContent = selectedCategory;
    jokeTextEl.textContent = joke.joke || '-';
    jokeResponseEl.textContent = joke.response || '-';
  } catch (err) {
    console.error('Error fetching joke:', err);
  }
});

// Dodawanie żartu
if (addForm) {
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category    = addCategorySelect.value;
    const jokeText    = addJokeInput.value.trim();
    const responseText= addResponseInput.value.trim();

    addStatusEl.textContent = '';
    addStatusEl.className = '';

    if (!category || !jokeText) {
      addStatusEl.textContent = 'Podaj kategorię i tekst żartu.';
      addStatusEl.classList.add('status-error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/jokebook/joke/${category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          joke: jokeText,
          response: responseText   // backend wymaga stringa, "" też przejdzie
        })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        addStatusEl.textContent = data && data.error
          ? `Błąd: ${data.error}`
          : 'Wystąpił błąd przy dodawaniu żartu.';
        addStatusEl.classList.add('status-error');
        return;
      }

      // backend zwraca { status: 'ok' }
      addStatusEl.textContent = 'Żart został dodany.';
      addStatusEl.classList.add('status-ok');

      addJokeInput.value = '';
      addResponseInput.value = '';
    } catch (err) {
      console.error('Error adding joke:', err);
      addStatusEl.textContent = 'Błąd sieci przy dodawaniu żartu.';
      addStatusEl.classList.add('status-error');
    }
  });
}



btnStats.addEventListener('click', async () => {
  try {
    const res = await fetch(`${API_BASE}/jokebook/stats`);
    if (!res.ok) {
      console.error('HTTP error:', res.status);
      return;
    }

    const stats = await res.json();

    statsTableBody.innerHTML = '';

    Object.entries(stats).forEach(([category, count]) => {
      const tr = document.createElement('tr');

      const tdCategory = document.createElement('td');
      tdCategory.textContent = category;

      const tdCount = document.createElement('td');
      tdCount.textContent = count;

      tr.appendChild(tdCategory);
      tr.appendChild(tdCount);

      statsTableBody.appendChild(tr);
    });

  } catch (err) {
    console.error('Error fetching stats:', err);
  }
});
