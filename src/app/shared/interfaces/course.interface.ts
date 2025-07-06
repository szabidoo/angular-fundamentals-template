export interface Course {
  title: string;
  description: string;
  creationDate: Date;
  duration: number;
  authors: string[];
  id: string;
  editable?: boolean;
}

export interface CourseResponse {
  successful: boolean;
  result: Course[];
}

export interface EditCourse {
  title: string;
  description: string;
  duration: number;
  authors: string[];
}

export interface SingleCourseResponse {
  successful: boolean;
  result: Course;
}

export interface CreateCourse {
  title: string;
  description: string;
  duration: number;
  authors: string[];
}
