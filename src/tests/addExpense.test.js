import { addExpense } from "../requestHelper";


// describe('SUCCESS TESTS', () =>{
//   test('Dummy Test', () => {
//     expect(addExpense(50, "Food")).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {amount: 50, category: 'Food'}
//     });
//   });
// });



describe('Invalid Expense Inputs', () =>{
  test('Negative Expense', () => {
    expect(addExpense(-500, "Food")).toStrictEqual({
      statusCode: 400,
      jsonBody: {error: expect.any(String)}
    })
  });
  test('String expense',() =>{
    expect(addExpense('123','Food')).toStrictEqual({
      statusCode: 400,
      jsonBody: {error: expect.any(String)}
    })
  });
  test('Empty String for expense',() =>{
    expect(addExpense('','Food')).toStrictEqual({
      statusCode: 400,
      jsonBody: {error: expect.any(String)}
    })
  }); 
});

describe('Invalid Category Inputs', () =>{
  test('Int type for Category', () => {
    expect(addExpense(23,20)).toStrictEqual({
      statusCode: 400,
      jsonBody: {error: expect.any(String)}
    });
  });
});

// When a defined set of categories have been created
// Tests for when input categories are outside the pre-defined set
