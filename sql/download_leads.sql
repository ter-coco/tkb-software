create table if not exists public.download_leads (
  id              bigserial primary key,
  product         text not null,                       -- รหัสโปรแกรม เช่น tkb-retail (ตรงกับ installs.product)
  name            text not null check (length(name) between 1 and 100),
  phone           text not null check (phone ~ '^0[0-9]{9}$'),  -- ตัวเลขล้วน 10 หลัก ใช้จับคู่ installs.phone ภายหลัง
  kind            text not null check (kind in ('download','notify')),
  consent_version text not null,
  user_agent      text not null default '',
  created_at      timestamptz not null default now()
);
create index if not exists download_leads_phone on public.download_leads (product, phone, created_at desc);
alter table public.download_leads enable row level security;   -- ไม่มี policy = API สาธารณะเข้าไม่ได้
