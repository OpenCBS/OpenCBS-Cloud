UPDATE public.loans
SET loan_officer_id = public.loan_applications.loan_officer_id
FROM public.loan_applications
WHERE public.loans.loan_application_id = loan_applications.id;