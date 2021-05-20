const express = require('express'); // require: 프로젝트 내에서 node module을 가져온다.
const app = express();
const PORT = 4000;

function handleListening() {
    console.log(`Listening on: http://localhost:${PORT}`);
}

app.listen(PORT, handleListening);