alter table entry_fees alter column max_value type decimal(12,4) using max_value::decimal;
alter table entry_fees alter column min_value type decimal(12,4) using min_value::decimal ;
alter table entry_fees alter column upper_limit type decimal(12,4) using upper_limit::decimal ;