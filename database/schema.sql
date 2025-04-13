-- Shopaholic Expense Schema
create sequence transaction_id_seq
	increment by 1
	start with 1
	no minvalue
	no maxvalue
	cache 1;


create table Transactions(
	transaction_id integer primary key default nextval('transaction_id_seq'),
	category varchar(20) not null,
	amount numeric(10,2) not null
		constraint positiveExpense
		check(amount > 0)			
);
