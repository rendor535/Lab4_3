'use strict';

const express = require('express');
const cors = require('cors'); 
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

app.use(cors());   

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});