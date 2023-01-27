do
$$
declare _rev integer;
begin
  insert into audit.REVINFO(REVTSTMP, username) values (extract(epoch from now()) * 1000, (select username from users where id = 1)) returning rev into _rev;
  insert into audit.roles_history(REV,REVTYPE,id,name) select _rev,0,id,name from roles where id = 2;

  insert into audit.REVINFO(REVTSTMP, username) values (extract(epoch from now()) * 1000, (select username from users where id = 1)) returning rev into _rev;
  insert into audit.roles_history(REV,REVTYPE,id,name) select _rev,0,id,name from roles where id = 1;
end
$$