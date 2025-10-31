export interface UserRequest {
    full_name: string;
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    full_name: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
}