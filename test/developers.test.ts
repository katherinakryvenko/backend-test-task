import "reflect-metadata";
import { request } from "./setup/shortcuts";
import { createRequestWithContainerOverrides } from "./setup/helpers";
import { DevelopersRepository } from "../src/domain/developers/repositories/developers.repository";

describe("Developers API tests examples", () => {
  it("should BAT fetch developers (e2e, real repository used)", async () => {
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

  it("should return a 404 error for nonexistent developer (e2e, real repository used)", async () => {
    const id = "123";
    const result = await request.get(`/api/developers/${id}`);

    expect(result.status).toBe(404);
    expect(result.body).toHaveProperty("error");
    expect(result.body.error.message).toBe(
      `Developer with id "${id}" not found`
    );
  });

  it("should BAT get developer by id (mocked repository used)", async () => {
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
    expect(developer).toHaveProperty("id");
    expect(developer).toHaveProperty("firstName");
    expect(developer).toHaveProperty("lastName");
    expect(developer).toHaveProperty("email");
    expect(developer).toHaveProperty("revenue");
  });
});
