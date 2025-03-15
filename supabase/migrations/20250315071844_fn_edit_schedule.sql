DROP FUNCTION IF EXISTS fn_edit_schedule(
    NUMERIC, 
    NUMERIC,
    JSONB, 
    INT8, 
    JSONB, 
    VARCHAR, 
    VARCHAR, 
    TIMESTAMP, 
    TIMESTAMP
);


CREATE OR REPLACE FUNCTION fn_edit_schedule(
    schedule_id NUMERIC,
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
