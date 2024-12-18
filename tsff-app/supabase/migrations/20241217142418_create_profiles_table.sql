create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  created_at timestamp default current_timestamp not null
);


-- Create a trigger function to handle new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Attach the trigger to the auth.users table
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();