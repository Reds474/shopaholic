drop function if exists categoryCost();

create or replace function categoryCost()
returns table (
  category varchar(20),
  amount numeric(10,2)
) as $$

begin
	return query
		select t.category, sum(t.amount)::numeric(10,2)
		from transactions t
		group by t.category
		order by sum(t.amount) desc;
end;
$$ language plpgsql;

