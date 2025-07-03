export interface Author {
  id: string;
  name: string;
}

export interface AuthorResponse {
  successful: boolean;
  result: Author[];
}

export interface SingleAuthorResponse {
  successful: boolean;
  result: Author;
}
