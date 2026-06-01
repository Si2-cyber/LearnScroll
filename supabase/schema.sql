-- LearnScroll Supabase setup
-- Run this file in the Supabase SQL editor for your project.

create extension if not exists pgcrypto;

create table if not exists public.cards (
  id text primary key,
  title text not null,
  category text not null,
  paragraphs jsonb not null default '[]'::jsonb,
  takeaway text not null,
  hashtags jsonb not null default '[]'::jsonb,
  background_color text not null default '#1E293B',
  channel_name text not null,
  likes_count integer not null default 0 check (likes_count >= 0),
  comments_count integer not null default 0 check (comments_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.card_likes (
  card_id text not null references public.cards(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (card_id, user_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cards_set_updated_at on public.cards;
create trigger cards_set_updated_at
before update on public.cards
for each row
execute function public.set_updated_at();

create or replace function public.toggle_card_like(p_card_id text, p_liked boolean)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  next_likes_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentication is required to like cards.';
  end if;

  if p_liked then
    insert into public.card_likes (card_id, user_id)
    values (p_card_id, current_user_id)
    on conflict do nothing;
  else
    delete from public.card_likes
    where card_id = p_card_id and user_id = current_user_id;
  end if;

  update public.cards
  set likes_count = (
    select count(*)::integer
    from public.card_likes
    where card_id = p_card_id
  )
  where id = p_card_id
  returning likes_count into next_likes_count;

  return coalesce(next_likes_count, 0);
end;
$$;

grant execute on function public.toggle_card_like(text, boolean) to anon, authenticated;

alter table public.cards enable row level security;
alter table public.card_likes enable row level security;

drop policy if exists "Cards are publicly readable" on public.cards;
create policy "Cards are publicly readable"
on public.cards
for select
using (true);

drop policy if exists "Authenticated users can read likes" on public.card_likes;
create policy "Authenticated users can read likes"
on public.card_likes
for select
to anon, authenticated
using (auth.uid() = user_id);

drop policy if exists "Authenticated users can insert their likes" on public.card_likes;
create policy "Authenticated users can insert their likes"
on public.card_likes
for insert
to anon, authenticated
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can delete their likes" on public.card_likes;
create policy "Authenticated users can delete their likes"
on public.card_likes
for delete
to anon, authenticated
using (auth.uid() = user_id);

insert into public.cards (id, title, category, paragraphs, takeaway, hashtags, background_color, channel_name, likes_count, comments_count)
values
  ('seed-atomic-habits', 'Atomic Habits: The 1% Rule', 'Book summaries', '["James Clear argues that massive success is not driven by single, monumental shifts, but by compounding tiny 1% daily improvements.", "To build a lasting habit, structure your environment so clean cues are obvious, positive actions are attractive, easy to start, and immediately satisfying.", "Conversely, to break a bad habit, reverse these laws: make the negative cue completely invisible, unattractive, difficult to execute, and unsatisfying."]'::jsonb, 'Focus on designing systems of steady compounding habits, rather than relying on sheer willpower or aiming for sudden goals.', '["Habits", "SelfImprovement", "Productivity"]'::jsonb, '#1E293B', 'BookWinds', 342, 18),
  ('seed-sky-blue', 'Why is the Sky Blue?', 'Trivia & fun facts', '["Sunlight reaches Earth''s atmosphere and is scattered in all directions by the gases and particles suspended in the air.", "Shorter wavelengths (blue and violet) are scattered much more than other colors because they travel in smaller, shorter waves — a process called Rayleigh scattering.", "Although violet light has an even shorter wavelength than blue, the sky looks blue because our eyes are highly sensitive to blue and because sunlight contains more blue light."]'::jsonb, 'Rayleigh scattering causes short blue lightwaves to scatter wildly across our atmosphere, painting our dome blue.', '["Physics", "Atmosphere", "ScienceFacts"]'::jsonb, '#0F172A', 'NatureLab', 520, 42),
  ('seed-stoicism', 'Marcus Aurelius & The Dichotomy of Control', 'Philosophy & quotes', '["At the core of Stoic philosophy is the Dichotomy of Control: separating all occurrences in life into things you control, and things you do not.", "Things under your total control include your thoughts, beliefs, impulses, desires, and your deliberate reactions to external events.", "Everything else — your reputation, your health, wealth, past events, and other people''s actions — falls entirely outside your absolute control."]'::jsonb, 'Save your intellectual energy: invest fully in your own choices, and practice radical acceptance toward what you cannot control.', '["Stoicism", "Philosophy", "MentalClarity"]'::jsonb, '#111827', 'WiseMind', 418, 29),
  ('seed-finance-rule', 'The 50/30/20 Budgeting Principle', 'Life skills & how-to tips', '["The 50/30/20 rule is a straightforward, reliable structure to allocate your monthly after-tax income into clear, manageable buckets.", "Allocate exactly 50% toward absolute needs (housing, food, utilities, insurances). This forms your non-negotiable living baseline.", "Dedicate 30% to personal wants (dining out, subscriptions, leisure), and allocate the remaining 20% directly into savings, investments, or debt paydown."]'::jsonb, 'Divide your income into Needs (50%), Wants (30%), and Future Savings (20%) to build automated financial durability.', '["PersonalFinance", "LifeSkills", "Budgeting"]'::jsonb, '#14532B', 'WealthFlow', 289, 15),
  ('seed-pomodoro', 'The Pomodoro & Ultradian Rhythm', 'Study & focus tips', '["Developed by Francesco Cirillo, the Pomodoro Technique involves breaking your work into intense, uninterrupted 25-minute sprints followed by a 5-minute pause.", "This rhythm leverages our biological ultradian cycles, which dictate that our brains can only maintain peak focus for 90 to 120 minutes before requiring rest.", "Every four sprints, step away for a deeper 15-to-30-minute systemic recovery period to flush away metabolic waste and reset cognitive capacity."]'::jsonb, 'Protect focus by scheduling high-intensity deep work sprints paired with intentional, screen-free micro-breaks.', '["DeepWork", "FocusTips", "BrainHealth"]'::jsonb, '#3F1A1B', 'FocusLabs', 611, 31),
  ('seed-tardigrades', 'The Indestructible Tardigrade', 'Science & nature facts', '["Tardigrades, or \"water bears,\" are eight-legged microscopic animals famous for surviving conditions that would immediately vaporize most organisms.", "When faced with high radiation, boiling heat, absolute zero, or the vacuum of space, they enter \"cryptobiosis,\" expelling 97% of their body''s water.", "They retract their limbs and suspend their metabolic processes completely, creating a protective glass-like sugar bubble around their cells."]'::jsonb, 'Water bears can suspend their metabolism almost indefinitely to endure extreme cosmic hazards, waking up perfectly healthy later.', '["Biology", "SpaceScience", "AmazingNature"]'::jsonb, '#1E1B4B', 'BioSphere', 840, 56),
  ('seed-music-focus', 'The Science of Focus Playlists', 'Music recommendations', '["Neuroscientific studies reveal that lyrics in music activate the language hubs of your brain, competing with the verbal tasks you are doing.", "For peak mental throughput, listen to steady, non-vocal audio such as ambient modular synthesizers, classical Baroque music, or cinematic scores.", "Steady, repetitive rhythms around 60–80 BPM help synchronize brain waves into a focused, highly productive alpha state."]'::jsonb, 'Listen to non-lyrical, 60–80 BPM instrumental background music to stabilize your attention and transition into a flow state.', '["MusicScience", "FocusFlow", "LofiFlow"]'::jsonb, '#2D0B3D', 'SoundWave', 375, 22),
  ('seed-alexandria-library', 'The Great Library of Alexandria', 'History highlights', '["The Library of Alexandria in Egypt was the ancient world''s premier research center, housing hundreds of thousands of papyrus scrolls.", "To build the archive, Egyptian authorities seized scrolls off every incoming ship, copied them, kept the originals, and returned the copies.", "Its decline was not a single dramatic fire, but a slow process of underfunding, civil wars, and shifting imperial priorities over centuries."]'::jsonb, 'The library was built by aggressively acquiring other nations'' original manuscripts and suffered a steady decline over centuries.', '["History", "AncientWorld", "LibraryScience"]'::jsonb, '#2F1E0E', 'Chronicles', 494, 43),
  ('seed-japanese-kintsugi', 'Kintsugi: The Beauty of Scars', 'Language learning snippets', '["Kintsugi (金継ぎ) literally translates from Japanese to \"golden joinery\" or \"to repair with gold.\"", "It is the ancient art of repairing broken pottery using liquid lacquer mixed with powdered precious metals such as gold, silver, or platinum.", "Philosophy-wise, it emphasizes Wabi-Sabi: accepting imperfections, valuing history, and viewing the fracture as a beautiful highlight rather than a flaw."]'::jsonb, 'Kintsugi teaches us not to hide our history or hardships, but to wear our repaired fractures with pride and visual grace.', '["JapanesePhilosophy", "Kintsugi", "ArtWisdom"]'::jsonb, '#0D3E3A', 'WordVoyage', 512, 38),
  ('seed-quantum-physics', 'Quantum Entanglement: Spooky Action', 'Science & nature facts', '["When two subatomic particles become entangled, their physical properties like spin or polarization become perfectly linked.", "Measuring the state of one particle instantly determines the state of its partner, regardless of whether they are separated by centimeters or lightyears.", "Albert Einstein famously doubted this finding, mockingly calling it \"spooky action at a distance\" because it challenged classical space limits."]'::jsonb, 'Information between entangled particles transfers instantly, revealing deep, non-local mechanics at the quantum foundation.', '["QuantumPhysics", "ScienceFact", "Astrophysics"]'::jsonb, '#1E293B', 'MicroCosm', 654, 47)
on conflict (id) do update
set
  title = excluded.title,
  category = excluded.category,
  paragraphs = excluded.paragraphs,
  takeaway = excluded.takeaway,
  hashtags = excluded.hashtags,
  background_color = excluded.background_color,
  channel_name = excluded.channel_name,
  likes_count = greatest(public.cards.likes_count, excluded.likes_count),
  comments_count = excluded.comments_count;

-- Realtime setup note:
-- In the Supabase Dashboard, enable Realtime for the public.cards table under Database > Replication.
-- Or run the following if your project permits it:
-- alter publication supabase_realtime add table public.cards;
