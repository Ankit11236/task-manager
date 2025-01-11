const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const morgan = require('morgan');

const app = express();
const port = 5100;


app.use(morgan('dev'));

// app.use(cors());
app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

// app.use('/', (req, res) => {
//   res.send('Hello from the API server!')
// })
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
