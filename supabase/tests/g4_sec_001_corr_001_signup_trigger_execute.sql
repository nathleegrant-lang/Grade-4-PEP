-- Execute only against an isolated reconstructed Grade 4 database after
-- G4-SEC-001-CORR-001. Synthetic Auth rows roll back with the transaction.
begin;

do $$
declare acl aclitem[];
begin
  select proacl into strict acl from pg_proc
  where oid='public.handle_new_user()'::regprocedure;
  if exists (select 1 from aclexplode(acl) where grantee=0 and privilege_type='EXECUTE') then
    raise exception 'C1: PUBLIC can execute signup trigger function';
  end if;
  if has_function_privilege('anon','public.handle_new_user()','EXECUTE') then
    raise exception 'C2: anon can execute signup trigger function';
  end if;
  if has_function_privilege('authenticated','public.handle_new_user()','EXECUTE') then
    raise exception 'C3: authenticated can execute signup trigger function';
  end if;
  if not has_function_privilege('service_role','public.handle_new_user()','EXECUTE') then
    raise exception 'C7: trusted service role lost execution privilege';
  end if;
  if not exists(select 1 from pg_trigger where tgrelid='auth.users'::regclass
    and tgname='on_auth_user_created' and not tgisinternal
    and tgfoid='public.handle_new_user()'::regprocedure) then
    raise exception 'C5: signup trigger is missing';
  end if;
end $$;

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,
  raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values
('00000000-0000-4000-8000-0000000004a1','00000000-0000-0000-0000-000000000000',
 'authenticated','authenticated','g4-corr-ordinary@example.invalid','',now(),
 '{"provider":"email","providers":["email"]}','{"full_name":"Synthetic Ordinary"}',now(),now()),
('00000000-0000-4000-8000-0000000004b2','00000000-0000-0000-0000-000000000000',
 'authenticated','authenticated','g4-corr-metadata@example.invalid','',now(),
 '{"provider":"email","providers":["email"]}',
 '{"full_name":"Synthetic Metadata","role":"admin"}',now(),now());

do $$ begin
  if (select count(*) from public.profiles where id in
    ('00000000-0000-4000-8000-0000000004a1','00000000-0000-4000-8000-0000000004b2')) <> 2 then
    raise exception 'C5: signup trigger did not provision exactly two profiles';
  end if;
  if exists (select 1 from public.profiles where id in
    ('00000000-0000-4000-8000-0000000004a1','00000000-0000-4000-8000-0000000004b2')
    and role <> 'parent'::public.app_role) then
    raise exception 'C6: metadata changed signup authority';
  end if;
end $$;

rollback;
