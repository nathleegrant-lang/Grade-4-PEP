-- G4-SEC-002: restore the intended correlation between the submitted payment
-- grade and the authoritative pricing-plan grade.
--
-- G4-SEC-001 used an unqualified outer "grade" reference inside a pricing_plans
-- subquery. Because pricing_plans also has a grade column, PostgreSQL resolved
-- both sides as plan.grade and stored the tautology plan.grade = plan.grade.

drop policy if exists "parents create own payments" on public.payments;

create policy "parents create own payments"
on public.payments for insert to authenticated
with check (
  parent_id = (select auth.uid())
  and payments.grade::text = 'grade4'
  and status::text = 'pending'
  and verified_by is null
  and verified_at is null
  and rejection_reason is null
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'parent'::public.app_role
  )
  and exists (
    select 1
    from public.pricing_plans plan
    where plan.code = payments.plan_code::text
      and plan.grade = payments.grade::text
      and plan.is_active = true
      and plan.code <> 'free'
      and plan.price_jmd = payments.amount_jmd
  )
);
