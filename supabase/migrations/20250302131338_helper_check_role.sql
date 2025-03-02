drop function if exists helper_check_role(uuid);

create or replace function helper_check_role(client_id uuid) returns varchar as $$
declare
    role_name varchar;
begin
    select name into role_name
    from public.roles_tb
    where id = client_id;
    
    return role_name;
end;
$$ language plpgsql security definer;