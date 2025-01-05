import { BadRequestError,UnauthorisedError,ForbiddenError } from "./errors.js";
import { dataStore } from "./dataStore.js";

export function addExpense(amount, category){
  // Store amount and category in persistent dataStore  
  // Validate the input
  if (typeof amount !== 'number' || amount <= 0) {
    //return res.status(400).json({ error: 'Invalid expense amount' });
    throw new BadRequestError('Negative expense or invalid amount type');
  }
  if(typeof category !== 'string'){
    throw new BadRequestError('Invalid Category Type');
  }
  dataStore.expenses.push({amount,category});

  return {amount, category};
}