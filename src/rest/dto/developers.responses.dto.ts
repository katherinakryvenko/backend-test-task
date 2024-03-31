import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { IDeveloper, IDeveloperExtended } from "../../domain/developers/types";

@ApiModel()
export class DeveloperDto implements IDeveloper {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  firstName?: string;

  @ApiModelProperty()
  lastName?: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  revenue?: number;

  static from(developer: IDeveloper | IDeveloperExtended): DeveloperDto {
    const dto = new DeveloperDto();
    dto.id = developer.id;
    dto.firstName = developer.firstName;
    dto.lastName = developer.lastName;
    dto.email = developer.email;

    if ("revenue" in developer && developer.revenue !== undefined) {
      dto.revenue = developer.revenue;
    }

    return dto;
  }
}
