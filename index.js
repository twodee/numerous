const express = require('express');

const app = express();
const port = 3030;

let n = 0;
let currentValue = 0;

app.get('/', (request, response) => {
  const i = n;
  n += 1;

  response.send(`
<html>
  <head>
    <title>Numerous</title>
    <style>
body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

input[type="checkbox"] {
  width: 200px;
  height: 200px;
}
    </style>
  </head>
  <body>
    <input id="toggle" type="checkbox">
    <script>

const toggle = document.getElementById('toggle');
toggle.addEventListener('input', () => {
  toggle.disabled = true;
  fetch('/toggle/${i}', {
    method: 'PATCH',
  }).then(() => {
    toggle.disabled = false;
  });
});

    </script>
  </body>
</html>
  `);
});

app.patch('/toggle/:i', (request, response) => {
  const i = parseInt(request.params.i);
  currentValue = currentValue ^ (1 << i);
  response.send(':)');
});

app.get('/c', (request, response) => {
  if (n < 8) {
    response.send({value: `Players: ${n}`});
  } else {
    response.send({value: currentValue});
  }
});

app.get('/v', (request, response) => {
  n = 0;
  response.send(`
<html>
  <head>
    <title>Numerous</title>
    <style>
body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  font-family: sans-serif;
  margin: 0;
}
    </style>
  </head>
  <body>
    <span id="value-text">${currentValue}</span>
    <script>

const valueText = document.getElementById('value-text');
setInterval(() => {
  fetch('/c')
    .then(response => response.json())
    .then(data => {
      valueText.innerText = data.value;
    });
}, 500);

    </script>
  </body>
</html>
  `);
});

app.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});
