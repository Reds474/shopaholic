import express, { json} from 'express';
import { addExpense } from './expenses.js'
import { BadRequestError, UnauthorisedError, ForbiddenError } from './errors.js';
import {pool} from './db.js'
import cors from "cors";

const app = express();
//const pool = require('./db');
const port = 3000;

app.use(express.json());
app.use(cors());

function handleError(res, error) {
  if (error instanceof BadRequestError) {
    return res.status(400).json({ error: error.message });
  }
  if (error instanceof UnauthorisedError) {
    return res.status(401).json({ error: error.message });
  }
  if (error instanceof ForbiddenError) {
    return res.status(403).json({ error: error.message });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
}

// Retrieving the database name
app.get('/', async(req,res) => {
  const result = await pool.query("select current_database()");
  res.send(`The database name is ${result.rows[0].current_database}`);
})

// Retrieving transactions
// Next step is to put it into a func
app.get('/transactions', async(req,res) =>{
  try {
    const result = await pool.query("SELECT * FROM transactions");
    res.json({
      message: "Transactions: ",
      data: result.rows,
    });

  } catch (error) {
      handleError(res,error);
  }
})


app.post('/expenses', (req, res) => {
  try {
    console.log('req',req.body);
    const {expense, category } = req.body; // Extract `expense` from the request body - same variable name as the requestHelper for addExpense
    // Call the addExpense function
    const result = addExpense(expense, category);

    // Return the result as the response
    res.status(200).json(result);
    console.log('RESULT',result)


  } catch (error) {

    handleError(res,error);  
  } 
});


app.get('/expenses', (req,res) =>{
  const response = 
  res.send('View Expenses')
})

//json() function converts the JSON string in the payload to a JSON 
// object and populates the req. body property with the parsed JSON, 
// which can be assessed in the application using the req. body object.
//app.use(express.json());

app.listen(port);


