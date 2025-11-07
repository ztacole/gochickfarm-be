export interface AnimalResponse {
    id: number;
    tag: string;
    species: string;
    age: string,
    sex: "Jantan" | "Betina";
    weight: number;
    birthdate: string;
    status: "Hidup" | "Mati" | "Terjual";
}

export interface AnimalRequest {
    species: string;
    birthdate: string;
    sex: "Jantan" | "Betina";
    weight: number;
}