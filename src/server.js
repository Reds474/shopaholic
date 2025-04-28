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



// View Funcs
// View interesting information about transactions

// View all past transactions
app.get('/view/transactions', async(req,res) =>{
  try {
    const result = await pool.query("select * FROM transactions");
    res.json({
      table: "Transactions:",
      data: result.rows,
    });

  } catch (error) {
      handleError(res,error);
  }
})

// View unique categories
app.get('/view/categories', async(req,res) =>{
  try {
    const result = await pool.query("select distinct category from transactions");
    res.json({
      categories: result.rows,
    });

  }catch(error){
    handleError(res,error);
  }
})

// View the most expensive transaction
app.get('/view/mostexpensive/transaction',async(req,res)=>{
  try {
    const result = await pool.query(`
      select * 
      from transactions 
      where amount=(select max(amount) 
                    from transactions)`
      )

    res.json({
      MostExpensiveTransactions: result.rows,
    })
  } catch (error) {
    handleError(res,error);
  }
})

// /view/mostfrequent/category
app.get('/view/mostfrequent/category', async(req,res)=>{
  try {
    // Create a view with a Table with categories and number of transactions
    await pool.query(`
      create or replace view categories as
      select category, count(*) as "transactions"
      from transactions
      group by category
      order by count(*) desc;`
    );

    // Selecting the view
    await pool.query(`
      select * 
      from categories;`
    );

    // Selecting the most frequent category from the view
    const result = await pool.query(`
      select category 
      from categories 
      where transactions=(select max(transactions) 
                          from categories);`);

    // Select the max from the view
    res.json({MostFrequentCategory: result.rows})
    
  } catch (error) {
    handleError(res,error)
  }
})

app.get('/view/category/expense/list', async(req,res)=>{
  try {
    const result = await pool.query("select * from categoryCost()");
    console.log(result.rows);

    res.json({
      table: "Expense List:",
      data: result.rows,
    });
    
  } catch (error) {
    handleError(res, error);
  }
})

app.post('/add/expense', async(req,res)=>{
  try{
    const{amount, category} = req.body;
    if (!amount || !category) {
      return res.status(400).send('Missing amount or category');
    }
    console.log(`Amount: ${amount}, Category ${category}`)
    await pool.query("insert into Transactions(amount,category) values($1,$2)",[amount,category])
    
    res.send(`Expense Successfully Added to the Database`);
  }
  catch(error){
    handleError(res, error);
  }
})


app.delete('/delete/expense/:transactionid', async(req,res) =>{
  
  try{
    const transactionId = parseInt(req.params.transactionid)

    if(!transactionId){
      console.log('asdas')
      throw new BadRequestError('transactionId is not a number');
    }
    // Error when the transaction_id is not in the database

    const result = await pool.query("SELECT * FROM transactions where transaction_id=$1",[transactionId]);

    if(result.rows.length === 0){
      throw new BadRequestError('transaction_id does not exist');
    }

    

    await pool.query('delete from transactions where transaction_id=$1',[transactionId]);
    res.send(`Transaction ${transactionId} successfully deleted!`);
  }
  catch(error){
    handleError(res,error)
  }
  
})



// Function to update transactions

// app.put('/update/expense', async(req,res) =>{
//   try{
//     const{expense} = req.body;
//     await pool.query();
//   }catch(error){
//     handleError(error)
//   }
// })






app.post('/expenses', (req, res) => {
  try {
    const {amount, category } = req.body; // Extract `expense` from the request body - same variable name as the requestHelper for addExpense
    // Call the addExpense function
    const result = addExpense(amount, category);

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


