const API_BASE = 'http://localhost:3000';

const btnCategories = document.getElementById('btnCategories');
const btnRandomJoke = document.getElementById('btnRandomJoke');
const categoriesList = document.getElementById('categoriesList');
const categorySelect = document.getElementById('categorySelect');

const jokeCategoryEl = document.getElementById('jokeCategory');
const jokeTextEl = document.getElementById('jokeText');
const jokeResponseEl = document.getElementById('jokeResponse');

let categories = [];

btnCategories.addEventListener('click', async () => {
  try {
    const res = await fetch(`${API_BASE}/jokebook/categories`);
    const data = await res.json();
    categories = data;

    categoriesList.innerHTML = '';
    categorySelect.innerHTML = '<option value="">-- wybierz kategorię --</option>';

    data.forEach(cat => {
      // lista UL
      const li = document.createElement('li');
      li.textContent = cat;
      categoriesList.appendChild(li);

      // select
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
});

btnRandomJoke.addEventListener('click', async () => {
  const selectedCategory = categorySelect.value;

  if (!selectedCategory) {
    alert('Najpierw wybierz kategorię.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/jokebook/joke/${selectedCategory}`);
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
