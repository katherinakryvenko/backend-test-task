import { inject, injectable } from "inversify";
import { DevelopersRepository } from "../repositories/developers.repository";
import { IDeveloper } from "../types";
import _ from "lodash";

@injectable()
export class DevelopersService {
  constructor(
    @inject("DevelopersRepository")
    private developersRepository: DevelopersRepository
  ) {}

  async getDevelopers(): Promise<IDeveloper[]> {
    const developers = await this.developersRepository.getDevelopers();
    return Promise.all(
      developers.map(async (developer) => {
        const revenue = await this.calculateDeveloperRevenue(developer.id);
        return { ...developer, revenue };
      })
    );
  }

  async getDeveloperById(id: string) {
    const developer = await this.developersRepository.getDeveloperById(id);
    const revenue = await this.calculateDeveloperRevenue(developer.id);
    return { ...developer, revenue };
  }

  private async calculateDeveloperRevenue(
    developerId: string
  ): Promise<number> {
    const contracts = await this.developersRepository.getContractsByDeveloperId(
      developerId
    );
    const completedContracts = _.filter(contracts, { status: "completed" });
    return _.sumBy(completedContracts, "amount");
  }
}
