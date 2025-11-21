export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
}

export interface Response<T> {
    data: T;
    message: string;
    status: number;
}

export interface ErrorResponse {
    message: string;
    status: number;
}