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
    const result = await pool.query("SELECT * FROM transactions");
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

app.get('/view/mostexpensive/list', async(req,res)=>{
  try {
    const result = await pool.query("SELECT * FROM transactions");
    const table = result.rows;

    let usedCategories = [];
    let amount = 0;
    let categoryList =[];
  
    for(const row in table){      
      if(table[row].category === 'Food'){
        amount = amount + parseFloat(table[row].amount);
        console.log(`Food amount current: $${amount}`)
      }
    }

    
    // Do this in postgres to give a table ordered by largest to smallest
    for(const row in table){
      
      if(usedCategories.includes(table[row].category) ===false){
        let resultSum = await pool.query(`select categoryCost('${table[row].category}')`);
        categoryList.push({category: `${table[row].category}`, amount: resultSum.rows[0].categorycost})
        usedCategories.push(table[row].category);
      }
    }
    console.log(categoryList);

    res.json({
      table: "Transactions:",
      data: result.rows,
    });
    
  } catch (error) {
    handleError(error);
  }
})


// Next view routes to be made
// /view/mostexpensive/list



// Insert data into the database ie. Add expenses

// Function to delete a specific transaction from the database (trigger??)






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


