export type DynamicForm = {
  code: string;
  section_id: number;
  subject_id: number;
  units: number;
  num_of_hours: {
    lecture: number;
    lab: number;
  };
};
