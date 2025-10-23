export interface AnimalResponse {
    id: number;
    tag: string;
    species: string;
    age: string,
    sex: "Jantan" | "Betina";
    weight: number;
    birthdate: string;
}

export interface AnimalRequest {
    tag: string;
    species_id: number;
    birthdate: string;
    sex: "Jantan" | "Betina";
    weight: number;
    status: "Hidup" | "Mati";
}