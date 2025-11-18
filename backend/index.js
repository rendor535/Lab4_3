'use strict';

const express = require('express');
const app = express();

let categories = ['funnyJoke', 'lameJoke'];

let funnyJoke = [
  {
    'joke': 'Dlaczego komputer poszedł do lekarza?',
    'response': 'Bo złapał wirusa!'
  },
  {
    'joke': 'Dlaczego komputer nie może być głodny?',
    'response': 'Bo ma pełen dysk!'
  },
  {
    'joke': 'Co mówi jeden bit do drugiego?',
    'response': '„Trzymaj się, zaraz się przestawiamy!”'
  }
];

let lameJoke = [

  {
    'joke': 'Dlaczego programiści preferują noc?',
    'response': 'Bo w nocy jest mniej bugów do łapania!'
  },
  {
    'joke': 'Na czym informatyk wiesza pranie?',
    'response': 'Na linkach! AAAAAAAAAAAAAAAAAAAAAAAAAAAHAHAHHGHBSRDFKBKHJgrbfgnkhjb,m trace zmysły'
  },
  {
    'joke': 'idą dwie mrówki przez lodowisko, i ta druga mówi do pierwszej, ej uważaj przerębel przed tobą, na co ta druga',
    'response': 'jaki przerembul bul bul bul'
  }
];

app.get('/jokebook/categories', (req, res) => {
  res.json(categories);
});

app.get('/jokebook/joke/:category', (req, res) => {
  const category = req.params.category;

  if (!categories.includes(category)) {
    return res.json({ error: `no jokes for category ${category}` });
  }

  const jokes = category === 'funnyJoke' ? funnyJoke : lameJoke;
  const random = jokes[Math.floor(Math.random() * jokes.length)];

  res.json(random);
});

app.post('/jokebook/joke/:category', (req, res) => {
  const category = req.params.category;
  const body = req.body;

  if (!body || typeof body.joke !== 'string' || typeof body.response !== 'string') {
    return res.status(400).json({ error: 'Invalid input. Use string' });
  }

  if (!jokebook[category]) {
    return res.status(404).json({ error: `no jokes for category ${category}` });
  }

  jokebook[category].push({
    joke: body.joke,
    response: body.response
  });

  return res.json({ status: 'ok' });
});

app.get('/jokebook/stats', (req, res) => {
  res.json({
    funnyJoke: funnyJoke.length,
    lameJoke: lameJoke.length
  });
});

app.get('/jokebook/search', (req, res) => {
  const word = req.query.word;
  if (!word || typeof word !== 'string') {
    return res.json([]);
  }
  const needle = word.toLowerCase();
  const results = [];

  const searchCategory = (categoryName, arr) => {
    for (const j of arr) {
      const jokeText = (j.joke || '').toLowerCase();
      const respText = (j.response || '').toLowerCase();
      if (jokeText.includes(needle) || respText.includes(needle)) {
        results.push({
          category: categoryName,
          joke: j.joke,
          response: j.response
        });
      }
    }
  };

  searchCategory('funnyJoke', funnyJoke);
  searchCategory('lameJoke', lameJoke);

  return res.json(results);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});