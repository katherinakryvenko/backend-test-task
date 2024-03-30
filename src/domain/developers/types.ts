export interface IDeveloper {
  id: string;

  firstName?: string;
  lastName?: string;

  email: string;

  revenue?: number;
}

export interface IContract {
  id: number;

  developerId: string;

  status: "pending" | "completed" | "ongoing";

  amount: number;
}
