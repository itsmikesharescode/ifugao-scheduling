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

export type MetaData = {
  email: string;
  gender: 'Male' | 'Female';
  status: string;
  role_id: string;
  lastname: string;
  firstname: string;
  birth_date: string;
  middlename: string;
  departments: number[];
  academic_rank: string;
  avatar_path: string | null;
};
