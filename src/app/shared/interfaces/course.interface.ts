import { Author } from "./author.interface";

export interface Course {
  title: string;
  description: string;
  creationDate: Date;
  duration: number;
  authors: Author[];
  id: string;
  editable?: boolean;
}

export interface CourseFromAPI {
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
  result: CourseFromAPI[];
}

export interface EditCourse {
  title: string;
  description: string;
  duration: number;
  authors: string[];
}

export interface SingleCourseResponse {
  successful: boolean;
  result: CourseFromAPI;
}

export interface CreateCourse {
  title: string;
  description: string;
  duration: number;
  authors: string[];
}
