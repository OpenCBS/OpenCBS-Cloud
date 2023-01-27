update
  permissions
set
  name = 'PAST_REPAYMENTS'
where
  name = 'PAST_FUTURE_REPAYMENTS';

update
  permissions
set
  name = 'PAST_RESCHEDULE'
where
  name = 'PAST_FUTURE_RESCHEDULE';