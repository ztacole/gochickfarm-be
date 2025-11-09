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