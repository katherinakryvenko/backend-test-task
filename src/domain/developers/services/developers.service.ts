import { inject, injectable } from "inversify";
import { DevelopersRepository } from "../repositories/developers.repository";
import { IDeveloper, IDeveloperExtended } from "../types";
import _ from "lodash";
import { NotFoundError } from "../../../common/errors/not-found.error";

@injectable()
export class DevelopersService {
  constructor(
    @inject("DevelopersRepository")
    private developersRepository: DevelopersRepository
  ) {}

  async getDevelopers(): Promise<IDeveloper[]> {
    return this.developersRepository.getDevelopers();
  }

  async getDevelopersExtended(): Promise<IDeveloperExtended[]> {
    const developers = await this.developersRepository.getDevelopers();

    return Promise.all(
      developers.map(async (developer) => {
        const revenue = await this.calculateDeveloperRevenue(developer.id);
        return { ...developer, revenue };
      })
    );
  }

  async getDeveloperById(id: string): Promise<IDeveloper> {
    const developer = await this.developersRepository.getDeveloperById(id);
    if (!developer) {
      throw new NotFoundError(`Developer with id "${id}" not found`);
    }

    return developer;
  }

  async getDeveloperByIdExtended(id: string): Promise<IDeveloperExtended> {
    const developer = await this.developersRepository.getDeveloperById(id);

    if (!developer) {
      throw new NotFoundError(`Developer with id "${id}" not found`);
    }

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
