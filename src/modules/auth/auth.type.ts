export interface LoginRequest {
    email: string;
    password: string;
}

export interface JwtPayload {
    id: number;
    email: string;
    full_name: string;
    role: {
        id: number;
        name: string;
    };
    session_id?: string;
}