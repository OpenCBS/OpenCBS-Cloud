update permissions
    set name = 'PAST/FUTURE_REPAYMENTS'
    where name = 'REPAYMENT_PERMISSION';

update loans_events
    set event_type = 'CLOSED'
    where event_type = 'CLOSING';