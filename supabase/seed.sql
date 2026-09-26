-- G4-DB-001-R1 portable non-customer reference seed.
-- Current verified Grade 4 pricing only. No identities, transactions, banking configuration, secrets, funnel or audit data.
insert into public.pricing_plans
(code,grade,name,price_jmd,period,description,features,max_students,badge_text,popular,is_active) values
('free','grade4','Free',0,'Free forever','Explore selected lessons and sample practice before upgrading.','["Selected lessons and sample practice","Free account dashboard","Basic progress tracking","One student profile"]'::jsonb,1,null,false,true),
('premium_family_monthly','grade4','Premium Family Monthly',10000,'per month','Full Grade 4 access for up to 4 students in one household.','["Full Grade 4 access for up to 4 students","Family-friendly monthly plan","All premium resources included","Great for siblings in one household"]'::jsonb,4,null,false,true),
('standard_monthly','grade4','Standard Monthly',3000,'per month','Full Grade 4 access for one student for one month.','["Everything in Standard Weekly","30-day access after approval","Detailed progress review","One student included"]'::jsonb,1,'Best Value',false,true),
('standard_weekly','grade4','Standard Weekly',1000,'per 7 days','Full Grade 4 access for one student for one week.','["Full Grade 4 access","Unlimited quizzes and mock tests","Worksheets, study guides, and certificates","Payment approval sets expiry automatically"]'::jsonb,1,'Popular',true,true)
on conflict (code) do update set grade=excluded.grade,name=excluded.name,price_jmd=excluded.price_jmd,period=excluded.period,
description=excluded.description,features=excluded.features,max_students=excluded.max_students,badge_text=excluded.badge_text,
popular=excluded.popular,is_active=excluded.is_active;
