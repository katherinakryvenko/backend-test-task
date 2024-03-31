import "reflect-metadata";
import { request } from "./setup/shortcuts";
import { createRequestWithContainerOverrides } from "./setup/helpers";
import { DevelopersRepository } from "../src/domain/developers/repositories/developers.repository";

describe("Developers API tests examples", () => {
  describe("E2E, real repository used", () => {
    it("should BAT fetch developers", async () => {
      const result = await request.get(`/api/developers`);

      expect(result.status).toBe(200);
      expect(result.body?.length).toBeGreaterThan(0);

      for (const developer of result.body) {
        expect(developer).toHaveProperty("id");
        expect(developer).toHaveProperty("firstName");
        expect(developer).toHaveProperty("lastName");
        expect(developer).toHaveProperty("email");
        expect(developer).toHaveProperty("revenue");
      }
    });

    it("should BAT return a 404 error for nonexistent developer", async () => {
      const id = "123";
      const result = await request.get(`/api/developers/${id}`);

      expect(result.status).toBe(404);
      expect(result.body).toHaveProperty("error");
      expect(result.body.error.message).toBe(
        `Developer with id "${id}" not found`
      );
    });
  });

  describe("Mocked repository used", () => {
    it("should BAT get developer by id", async () => {
      const req = await createRequestWithContainerOverrides({
        DevelopersRepository: {
          toConstantValue: {
            getDeveloperById: async (_id) => ({
              id: "65de346c255f31cb84bd10e9",
              email: "Brandon30@hotmail.com",
              firstName: "Brandon",
              lastName: "D'Amore",
            }),

            getContractsByDeveloperId: async (_id) => [
              {
                id: 1,
                developerId: "65de3467255f31cb84bd071d",
                status: "pending",
                amount: 5000,
              },
            ],
          } as Partial<DevelopersRepository>,
        },
      });
      const result = await req.get(`/api/developers/65de346c255f31cb84bd10e9`);

      expect(result.status).toBe(200);

      const developer = result.body;
      expect(developer).toHaveProperty("id");
      expect(developer).toHaveProperty("firstName");
      expect(developer).toHaveProperty("lastName");
      expect(developer).toHaveProperty("email");
      expect(developer).toHaveProperty("revenue");
    });

    it("should BAT calculate developer's revenue correctly (>0 revenue)", async () => {
      const req = await createRequestWithContainerOverrides({
        DevelopersRepository: {
          toConstantValue: {
            getDeveloperById: async (_id) => ({
              id: "65de346c255f31cb84bd10e9",
              email: "Brandon30@hotmail.com",
              firstName: "Brandon",
              lastName: "D'Amore",
            }),

            getContractsByDeveloperId: async (_id) => [
              {
                id: 1,
                developerId: "65de3467255f31cb84bd071d",
                status: "pending",
                amount: 5000,
              },
              {
                id: 2,
                developerId: "65de346c255f31cb84bd10e9",
                status: "completed",
                amount: 12000,
              },
            ],
          } as Partial<DevelopersRepository>,
        },
      });

      const result = await req.get(`/api/developers/65de346c255f31cb84bd10e9`);

      expect(result.status).toBe(200);

      const developer = result.body;
      expect(developer.revenue).toBe(12000);
    });

    it("should BAT calculate developer's revenue correctly (=0 revenue when no completed projects)", async () => {
      const req = await createRequestWithContainerOverrides({
        DevelopersRepository: {
          toConstantValue: {
            getDeveloperById: async (_id) => ({
              id: "65de3467255f31cb84bd071d",
              email: "Don_Quitzon@hotmail.com",
              firstName: "Don",
              lastName: "Quitzon",
            }),

            getContractsByDeveloperId: async (_id) => [
              {
                id: 1,
                developerId: "65de3467255f31cb84bd071d",
                status: "pending",
                amount: 5000,
              },
              {
                id: 2,
                developerId: "65de3467255f31cb84bd071d",
                status: "ongoing",
                amount: 12000,
              },
            ],
          } as Partial<DevelopersRepository>,
        },
      });

      const result = await req.get(`/api/developers/65de3467255f31cb84bd071d`);

      expect(result.status).toBe(200);

      const developer = result.body;

      expect(developer.revenue).toBe(0);
    });
  });
});
