export interface BreedingLogByAnimalResponse {
    id: number;
    animal_pair: {
        id: number;
        tag: string;
        sex: "Jantan" | "Betina";
    }
    offspring_count: number;
    mating_date: string;
}

export interface BreedingLogRequest {
    animal_id: number;
    pair_id: number;
    mating_date: string;
    offspring_count: number;
    offspring_animals: OffspringAnimalRequest[];
}

interface OffspringAnimalRequest {
    sex: "Jantan" | "Betina";
    weight: number;
}