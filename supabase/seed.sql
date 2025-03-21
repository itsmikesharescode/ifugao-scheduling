

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."fn_add_schedule"("faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    day_value TEXT;
    day_array TEXT[];
    new_subject_id TEXT;
    new_start_time TIME;
    new_end_time TIME;
BEGIN
    -- Convert JSONB array to text array for easier processing
    SELECT array_agg(value::TEXT) INTO day_array FROM jsonb_array_elements_text(days);
    
    -- Extract subject_id from dynamic_form
    new_subject_id := (dynamic_form->0->>'subject_id');
    
    -- Extract only the time component (ignoring date)
    new_start_time := start_time::TIME;
    new_end_time := end_time::TIME;
    
    -- Check for time conflicts
    FOR day_value IN SELECT unnest(day_array) LOOP
        IF EXISTS (
            SELECT 1 FROM schedules_tb
            WHERE schedules_tb.faculty_id = fn_add_schedule.faculty_id
            AND day_value = ANY(SELECT jsonb_array_elements_text(schedules_tb.days))
            AND (
                -- Check if new schedule overlaps with existing schedule, comparing only TIME components
                (new_start_time < schedules_tb.end_time::TIME AND new_end_time > schedules_tb.start_time::TIME)
            )
        ) THEN
            RAISE EXCEPTION 'Time conflict found for %. Faculty already has a schedule during this time range.', day_value
            USING ERRCODE = '23505';  -- unique_violation error code
        END IF;
    END LOOP;
    
    -- If no conflicts, insert the new schedule
    INSERT INTO schedules_tb (
        faculty_id,
        department_id,
        semester,
        school_year,
        days,
        start_time,
        end_time,
        dynamic_form
    ) VALUES (
        faculty_id,
        department_id,
        semester,
        school_year,
        days,
        start_time,
        end_time,
        dynamic_form
    );
    
    RETURN 'Schedule added successfully';
END;
$$;


ALTER FUNCTION "public"."fn_add_schedule"("faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_edit_schedule"("schedule_id" numeric, "faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    day_value TEXT;
    day_array TEXT[];
    new_subject_id TEXT;
    new_start_time TIME;
    new_end_time TIME;
BEGIN
    -- Convert JSONB array to text array for easier processing
    SELECT array_agg(value::TEXT) INTO day_array FROM jsonb_array_elements_text(days);
    
    -- Extract subject_id from dynamic_form
    new_subject_id := (dynamic_form->0->>'subject_id');
    
    -- Extract only the time component (ignoring date)
    new_start_time := start_time::TIME;
    new_end_time := end_time::TIME;
    
    -- Check for time conflicts, excluding the current schedule being edited
    FOR day_value IN SELECT unnest(day_array) LOOP
        IF EXISTS (
            SELECT 1 FROM schedules_tb
            WHERE schedules_tb.faculty_id = fn_edit_schedule.faculty_id
            AND schedules_tb.id != fn_edit_schedule.schedule_id  -- Exclude current schedule
            AND day_value = ANY(SELECT jsonb_array_elements_text(schedules_tb.days))
            AND (
                -- Check if new schedule overlaps with existing schedule, comparing only TIME components
                (new_start_time < schedules_tb.end_time::TIME AND new_end_time > schedules_tb.start_time::TIME)
            )
        ) THEN
            RAISE EXCEPTION 'Time conflict found for %. Faculty already has a schedule during this time range.', day_value
            USING ERRCODE = '23505';  -- unique_violation error code
        END IF;
    END LOOP;
    
    -- If no conflicts, update the existing schedule
    UPDATE schedules_tb SET
        faculty_id = fn_edit_schedule.faculty_id,
        department_id = fn_edit_schedule.department_id,
        semester = fn_edit_schedule.semester,
        school_year = fn_edit_schedule.school_year,
        days = fn_edit_schedule.days,
        start_time = fn_edit_schedule.start_time,
        end_time = fn_edit_schedule.end_time,
        dynamic_form = fn_edit_schedule.dynamic_form
    WHERE id = fn_edit_schedule.schedule_id;
    
    -- Check if the update affected any rows
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Schedule with ID % not found', schedule_id
        USING ERRCODE = '02000';  -- no_data error code
    END IF;
    
    RETURN 'Schedule updated successfully';
END;
$$;


ALTER FUNCTION "public"."fn_edit_schedule"("schedule_id" numeric, "faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."helper_admin_setter"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."helper_admin_setter"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."helper_check_role"("client_id" "uuid") RETURNS character varying
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
    role_name varchar;
begin
    select name into role_name
    from public.roles_tb
    where id = client_id;
    
    return role_name;
end;
$$;


ALTER FUNCTION "public"."helper_check_role"("client_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_created"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."on_auth_user_created"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_updated"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."on_auth_user_updated"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."deparments_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "color" "text" NOT NULL
);


ALTER TABLE "public"."deparments_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."deparments_tb" IS 'list of created departments';



ALTER TABLE "public"."deparments_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."deparments_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."faculties_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text" NOT NULL,
    "middle_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "gender" character varying NOT NULL,
    "academic_rank" "text" NOT NULL,
    "birth_date" "text" NOT NULL,
    "status" "text" NOT NULL,
    "departments" "jsonb" NOT NULL
);


ALTER TABLE "public"."faculties_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."faculties_tb" IS 'list of faculties';



ALTER TABLE "public"."faculties_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."faculties_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."roles_tb" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying NOT NULL,
    "description" "text" NOT NULL
);


ALTER TABLE "public"."roles_tb" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schedules_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "faculty_id" bigint NOT NULL,
    "department_id" bigint NOT NULL,
    "semester" character varying NOT NULL,
    "school_year" character varying NOT NULL,
    "days" "jsonb" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "dynamic_form" "jsonb" NOT NULL
);


ALTER TABLE "public"."schedules_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."schedules_tb" IS 'list of faculty schedules';



ALTER TABLE "public"."schedules_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."schedules_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."sections_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "departments" "jsonb" NOT NULL
);


ALTER TABLE "public"."sections_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."sections_tb" IS 'list of created sections';



ALTER TABLE "public"."sections_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."sections_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."subjects_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "departments" "jsonb" NOT NULL
);


ALTER TABLE "public"."subjects_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."subjects_tb" IS 'list of created table';



ALTER TABLE "public"."subjects_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."subjects_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users_role_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_role_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."users_role_tb" IS 'list of user roles';



ALTER TABLE "public"."users_role_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_role_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users_tb" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "meta_data" "jsonb" NOT NULL
);


ALTER TABLE "public"."users_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."users_tb" IS 'list of created users';



ALTER TABLE ONLY "public"."deparments_tb"
    ADD CONSTRAINT "deparments_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faculties_tb"
    ADD CONSTRAINT "faculties_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedules_tb"
    ADD CONSTRAINT "schedules_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sections_tb"
    ADD CONSTRAINT "sections_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subjects_tb"
    ADD CONSTRAINT "subjects_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_role_tb"
    ADD CONSTRAINT "users_role_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."schedules_tb"
    ADD CONSTRAINT "schedules_tb_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_role_tb"
    ADD CONSTRAINT "users_role_tb_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_role_tb"
    ADD CONSTRAINT "users_role_tb_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow all if auth" ON "public"."faculties_tb" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all if auth" ON "public"."schedules_tb" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all if auth" ON "public"."sections_tb" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all if auth" ON "public"."subjects_tb" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow all if authenticated" ON "public"."deparments_tb" TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."deparments_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."faculties_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schedules_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sections_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subjects_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users_role_tb" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."fn_add_schedule"("faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_add_schedule"("faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_add_schedule"("faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_edit_schedule"("schedule_id" numeric, "faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_edit_schedule"("schedule_id" numeric, "faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_edit_schedule"("schedule_id" numeric, "faculty_id" numeric, "days" "jsonb", "department_id" bigint, "dynamic_form" "jsonb", "school_year" character varying, "semester" character varying, "start_time" timestamp without time zone, "end_time" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."helper_admin_setter"() TO "anon";
GRANT ALL ON FUNCTION "public"."helper_admin_setter"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."helper_admin_setter"() TO "service_role";



GRANT ALL ON FUNCTION "public"."helper_check_role"("client_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."helper_check_role"("client_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."helper_check_role"("client_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "service_role";


















GRANT ALL ON TABLE "public"."deparments_tb" TO "anon";
GRANT ALL ON TABLE "public"."deparments_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."deparments_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."deparments_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."deparments_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."deparments_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."faculties_tb" TO "anon";
GRANT ALL ON TABLE "public"."faculties_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."faculties_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."faculties_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."faculties_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."faculties_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."roles_tb" TO "anon";
GRANT ALL ON TABLE "public"."roles_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."roles_tb" TO "service_role";



GRANT ALL ON TABLE "public"."schedules_tb" TO "anon";
GRANT ALL ON TABLE "public"."schedules_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."schedules_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedules_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedules_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedules_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sections_tb" TO "anon";
GRANT ALL ON TABLE "public"."sections_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."sections_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sections_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sections_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sections_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."subjects_tb" TO "anon";
GRANT ALL ON TABLE "public"."subjects_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."subjects_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."subjects_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."subjects_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."subjects_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users_role_tb" TO "anon";
GRANT ALL ON TABLE "public"."users_role_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."users_role_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_role_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_role_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_role_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users_tb" TO "anon";
GRANT ALL ON TABLE "public"."users_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."users_tb" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
