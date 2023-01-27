-- DELETE ALL ENTRY FEES --

delete from accounts
where parent_id = (select id
                    from accounts
                    where name = 'Service Fees');