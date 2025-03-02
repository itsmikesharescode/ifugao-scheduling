create or replace function helper_admin_setter() returns void as $$
begin
    update auth.users
    set raw_user_meta_data = '{
            "role_id": "4cd621d3-4ea3-4256-8679-1b5a68473b33",
            "firstname": "Local Admin",
            "lastname": "Local Admin",
            "middlename": "Local Admin",
            "birth_date": "2024-01-01",
            "gender": "Male"
        }'::jsonb
    where email = 'localadmin@gmail.com';
end;
$$ language plpgsql security definer;