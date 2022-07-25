import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateProjectDto {
  @IsUUID()
  id: string;

  name?: string;

  description?: string;
}

export class InsertProjectDto {
  @IsNotEmpty()
  name: string;

  description?: string;
}
