do
$func$
declare
  x int := 1;
  efname record;
begin
  for efname in select * from entry_fees where name in (select name from entry_fees group by name having count(name) > 1) loop
    update entry_fees set name = efname.name || x where id = efname.id;
    x := x + 1;
  end loop;
end;
$func$;

alter table entry_fees
  add constraint entry_fees_name_unique
  unique (name);
