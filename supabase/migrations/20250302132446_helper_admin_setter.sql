CREATE OR REPLACE FUNCTION helper_admin_setter() 
RETURNS VOID AS $$
BEGIN
    UPDATE auth.users
    SET raw_user_meta_data = '{
            "role_id": "4cd621d3-4ea3-4256-8679-1b5a68473b33",
            "firstname": "Local Admin",
            "lastname": "Local Admin",
            "middlename": "Local Admin",
            "birth_date": "2024-01-01",
            "gender": "Male"
        }'::JSONB
    WHERE email = 'localadmin@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;