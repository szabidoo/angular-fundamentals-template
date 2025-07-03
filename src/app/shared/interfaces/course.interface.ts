export interface Course {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  duration: number;
  authors: string[];
  editable: boolean;
}

export interface APICourse {
  title: string;
  description: string;
  creationDate: string;
  duration: number;
  authors: string[];
  id: string;
}

export interface CourseResponse {
  successful: boolean;
  result: APICourse[];
}

export interface EditCourse {
  title: string;
  description: string;
  duration: number;
  authors: string[];
}

export interface SingleCourseResponse {
  successful: boolean;
  result: APICourse;
}

export interface CreateCourse {
  title: string;
  description: string;
  duration: string;
  authors: string[];
}
