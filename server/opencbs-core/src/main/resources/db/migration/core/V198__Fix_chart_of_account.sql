update accounts
set
    type      = 3,
    parent_id = (select
                     id
                 from
                     accounts
                 where
                     number = '1001')
where
    number in ('1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010');

update accounts
set
    type = 4
where
    number in
    ('1002001', '1002002', '1002003', '1002004', '1005001', '1005002', '1005003', '1009001',
    '1009002', '1009003', '1010001', '1010002', '1010003', '1010004', '1012001', '1012002', '1012003',
    '1012004', '1013002', '1013003', '1013004', '1013005', '1013006', '1013007', '1013008', '1013009',
    '1014001', '1014002', '1014003');

update accounts
set
    type      = 3,
    parent_id = (select
                     id
                 from
                     accounts
                 where
                     number = '1011')
where
    number in ('1012', '1013', '1014');

--fix liabilities accounts

update accounts
set
    type      = 3,
    parent_id = (select
                     id
                 from
                     accounts
                 where
                     number = '2001')
where
    number in ('2002', '2003', '2004');

update accounts
set
    type = 4
where
    number in ('2003001', '2003002', '2003003', '2003004', '2004001', '2009001');

update accounts
set
    type      = 3,
    parent_id = (select
                     id
                 from
                     accounts
                 where
                     number = '2005')
where
    number in ('2006', '2007', '2008', '2009');

--fix equities accounts

update accounts
set
    type = 3
where
    number in ('3001', '3002', '3003');

update accounts
set
    type = 4
where
    number in ('3001001', '3001002', '3001003', '3003001', '3003002', '3003003');

-- fix revenues accounts
update accounts
set
    type = 3
where
    number in ('4001', '4002');

update accounts
set
    type = 4
where
    number in ('4001002', '4001003', '4001004', '4002001', '4002002', '4002003', '4002004', '4002005', '4002006', '4001001');

--fix expences account
update accounts
set
    type = 3
where
    number in ('5001', '5002', '5003', '5004');
update accounts
set
    type = 4
where
    number in
    ('5001001', '5001002', '5001003', '5003001', '5003002', '5003003',
    '5003004', '5003005', '5003006', '5003007', '5004001', '5004002',
    '5004003', '5004004', '5004005', '5004006', '5004007', '5004008',
    '5004009', '5004010', '5004011', '5004012', '5004013', '5004014',
    '5004015', '5004016', '5004017', '7001');