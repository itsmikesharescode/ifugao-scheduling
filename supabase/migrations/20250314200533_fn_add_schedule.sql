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
$$ LANGUAGE plpgsql SECURITY DEFINER;
