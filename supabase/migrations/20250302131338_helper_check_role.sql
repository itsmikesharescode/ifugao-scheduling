DROP FUNCTION IF EXISTS helper_check_role(UUID);

CREATE OR REPLACE FUNCTION helper_check_role(client_id UUID) 
RETURNS VARCHAR AS $$
DECLARE
    role_name VARCHAR;
BEGIN
    SELECT name INTO role_name
    FROM public.roles_tb
    WHERE id = client_id;
    
    RETURN role_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;