DROP FUNCTION IF EXISTS fn_add_schedule(
    NUMERIC, 
    JSONB, 
    INT8, 
    JSONB, 
    VARCHAR, 
    VARCHAR, 
    TIMESTAMP, 
    TIMESTAMP
);


CREATE OR REPLACE FUNCTION fn_add_schedule(
    faculty_id NUMERIC,
    days JSONB,
    department_id INT8,
    dynamic_form JSONB,
    school_year VARCHAR,
    semester VARCHAR,
    start_time TIMESTAMP,
    end_time TIMESTAMP
)
RETURNS TEXT AS $$
DECLARE
    day_value TEXT;
    conflict_found BOOLEAN := FALSE;
    conflict_message TEXT := '';
    day_array TEXT[];
BEGIN
    -- Convert JSONB array to text array for easier processing
    SELECT array_agg(value::TEXT) INTO day_array FROM jsonb_array_elements_text(days);
    
    -- Check for time conflicts
    FOR day_value IN SELECT unnest(day_array) LOOP
        IF EXISTS (
            SELECT 1 FROM schedules_tb
            WHERE schedules_tb.faculty_id = fn_add_schedule.faculty_id
            AND day_value = ANY(SELECT jsonb_array_elements_text(schedules_tb.days))
            AND (
                -- Check if new schedule overlaps with existing schedule
                (fn_add_schedule.start_time <= schedules_tb.end_time AND fn_add_schedule.end_time >= schedules_tb.start_time)
            )
        ) THEN
            RAISE EXCEPTION 'Time conflict found for %', day_value
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
