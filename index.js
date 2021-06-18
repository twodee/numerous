const express = require('express');

const app = express();
const port = 3030;

let n = 0;
let targetN = 8;
let currentValue = 0;
let sessionId = -1;

app.get('/', (request, response) => {
  const i = n;
  if (i < targetN) {
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
    const options = {
      method: 'PATCH',
    };
    fetch('/toggle/${i}/session/${sessionId}', options)
      .then(response => response.json())
      .then(data => {
        if (!data.ok) {
          alert(data.message);
        }
        toggle.disabled = false;
      });
  });

      </script>
    </body>
  </html>
    `);
  } else {
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
    font-family: sans-serif;
    font-size: 48px;
  }

      </style>
    </head>
    <body>
      This round has enough players already.
    </body>
  </html>
    `);
  }
});

app.patch('/toggle/:i/session/:sessionId', (request, response) => {
  const playerSessionId = parseInt(request.params.sessionId);
  if (playerSessionId === sessionId) {
    const i = parseInt(request.params.i);
    currentValue = currentValue ^ (1 << i);
    response.send({
      ok: true,
      message: ':)',
    });
  } else {
    response.send({
      ok: false,
      message: 'Your round is over.',
    });
  }
});

app.get('/c', (request, response) => {
  if (n < targetN) {
    response.send({value: `Players: ${n}/${targetN}`});
  } else {
    response.send({value: currentValue});
  }
});

app.get('/v/:target', (request, response) => {
  const oldSessionId = sessionId;
  do {
    sessionId = Math.floor(Math.random() * 10000000);
  } while (sessionId === oldSessionId);

  targetN = parseInt(request.params.target);
  n = 0;
  currentValue = 0;

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
    <span id="value-text"></span>
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
