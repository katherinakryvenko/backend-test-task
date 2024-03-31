export interface IDeveloper {
  id: string;

  firstName?: string;
  lastName?: string;

  email: string;
}

export interface IDeveloperExtended extends IDeveloper {
  revenue: number;
}

export interface IContract {
  id: number;

  developerId: string;

  status: "pending" | "completed" | "ongoing";

  amount: number;
}
