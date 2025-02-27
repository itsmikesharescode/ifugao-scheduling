export type DynamicForm = {
  code: string;
  section_id: string;
  subject_id: string;
  units: number;
  num_of_hours: {
    lecture: number;
    lab: number;
  };
};
