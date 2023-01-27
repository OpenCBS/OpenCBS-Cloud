create table account_tags (
  id   bigint       primary key,
  name varchar(255) not null,
  unique (name)
);

insert into account_tags(id, name)
values
  (1, 'ASSET'),
  (2, 'LIABILITIES'),
  (3, 'EQUITY'),
  (5, 'REVENUES'),
  (6, 'EXPENSES'),
  (7, 'OFF_BALANCE'),
  (8, 'TELLER'),
  (9, 'CURRENT_ACCOUNT'),
  (10, 'GAIN_ACCOUNT'),
  (11, 'LOSS_ACCOUNT');

create table accounts_account_tags (
  id              bigserial primary key,
  account_id      bigint not null references accounts (id),
  account_tag_id  bigint not null references account_tags (id),
  unique (account_id, account_tag_id)
);

insert into accounts_account_tags(account_id, account_tag_id)
values
  ((select id from accounts where name = 'ASSETS '), 1),
  ((select id from accounts where name = 'LIABILITIES'), 2),
  ((select id from accounts where name = 'EQUITY'), 3),
  ((select id from accounts where name = 'EXPENSES'), 6),
  ((select id from accounts where name = 'OFF BALANCE SECTION'), 7);

-- Clear global settings

do
$$
declare
  is_account_exist boolean;
begin

  select count(*) > 0 from accounts where number = (select value from global_settings where name = 'DEFAULT_CURRENT_ACCOUNT_GROUP') into is_account_exist;
  if is_account_exist then
    insert into accounts_account_tags(account_id, account_tag_id)
    values ((select id from accounts where number = (select value from global_settings where name = 'DEFAULT_CURRENT_ACCOUNT_GROUP')), 9);
    delete from global_settings where name = 'DEFAULT_CURRENT_ACCOUNT_GROUP';
  end if;

  select count(*) > 0 from accounts where number = (select value from global_settings where name = 'GAIN_ACCOUNT') into is_account_exist;
  if is_account_exist then
    insert into accounts_account_tags(account_id, account_tag_id)
    values ((select id from accounts where number = (select value from global_settings where name = 'GAIN_ACCOUNT')), 10);
    delete from global_settings where name = 'GAIN_ACCOUNT';
  end if;

  select count(*) > 0 from accounts where number = (select value from global_settings where name = 'LOSS_ACCOUNT') into is_account_exist;
  if is_account_exist then
    insert into accounts_account_tags(account_id, account_tag_id)
    values ((select id from accounts where number = (select value from global_settings where name = 'LOSS_ACCOUNT')), 11);
    delete from global_settings where name = 'LOSS_ACCOUNT';
  end if;

end;
$$;

-- Set to accounts parent tags

do
$$
declare
  this_record_id record;
  this_parent_id_lvl_2 record;
  this_parent_id_lvl_3 record;
  this_parent_id_lvl_4 record;
  this_tag_id record;
begin
  for this_record_id in
  select id from accounts_account_tags
  loop

    select id from account_tags where id = (select account_tag_id from accounts_account_tags where id = this_record_id.id::bigint) into this_tag_id;

    -- 2 level, Group
    for this_parent_id_lvl_2 in
    select id from accounts where parent_id = (select account_id from accounts_account_tags where id = this_record_id.id::bigint)
    loop
      insert into accounts_account_tags(account_id, account_tag_id)
        select this_parent_id_lvl_2.id, this_tag_id.id from accounts where id = this_parent_id_lvl_2.id;
      -- 3 level, SubGroup
      for this_parent_id_lvl_3 in
      select id from accounts where parent_id = this_parent_id_lvl_2.id
      loop
        insert into accounts_account_tags(account_id, account_tag_id)
          select this_parent_id_lvl_3.id, this_tag_id.id from accounts where id = this_parent_id_lvl_3.id;
        -- 4 level, Balance
        for this_parent_id_lvl_4 in
        select id from accounts where parent_id = this_parent_id_lvl_3.id
        loop
          insert into accounts_account_tags(account_id, account_tag_id)
            select this_parent_id_lvl_4.id, this_tag_id.id from accounts where id = this_parent_id_lvl_4.id;
        end loop;
      end loop;
    end loop;
  end loop;
end
$$;