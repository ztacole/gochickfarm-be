export interface AnimalResponse {
    id: number;
    tag: string;
    species: string;
    age: string,
    sex: "Jantan" | "Betina";
    weight: number;
    birthdate: string;
}