UPDATE public.global_settings
SET value = '"BL" + loan_id'
WHERE name = 'LOAN_CODE_PATTERN';

UPDATE public.global_settings
SET value = 'application.getCreatedBy().getBranch().getName() + "/" + new Date().getFullYear().toString().substr(-2)+ "/" + application.getLoanProduct().getCode()+ "/" + profile_id + "/" + application_id'
WHERE name = 'LOAN_APPLICATION_CODE_PATTERN';