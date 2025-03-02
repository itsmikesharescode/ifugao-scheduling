
-- First drop the trigger
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists on_auth_user_created();

drop trigger if exists on_auth_user_updated on auth.users;
drop function if exists on_auth_user_updated();


create or replace function on_auth_user_created()
returns trigger as $$
declare
    var_role text;
    var_role_id uuid;
    var_meta_data jsonb;
begin
  var_role := new.raw_user_meta_data ->> 'role'; 
  var_role_id := (new.raw_user_meta_data ->> 'role_id')::uuid;
  var_meta_data := new.raw_user_meta_data;

  insert into public.users_tb (user_id, meta_data) values(new.id, var_meta_data);

  insert into public.users_role_tb (role_id, user_id) values(var_role_id, new.id);

  return new;

end;
$$ language plpgsql security definer;

-- trigger the function every time a user is created
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure on_auth_user_created();


create or replace function on_auth_user_updated()
returns trigger as $$
declare
    var_role text;
    var_role_id uuid;
    var_meta_data jsonb;
begin
  var_role := new.raw_user_meta_data ->> 'role'; 
  var_role_id := (new.raw_user_meta_data ->> 'role_id')::uuid;
  var_meta_data := new.raw_user_meta_data;

  update public.users_tb 
  set
    meta_data = var_meta_data
  where user_id = new.id;

  update public.users_role_tb
  set
    role_id = var_role_id
  where user_id = new.id;

  return new;

end;
$$ language plpgsql security definer;

-- trigger the function every time a user is updated
create trigger on_auth_user_updated
after update on auth.users
for each row execute procedure on_auth_user_updated();




