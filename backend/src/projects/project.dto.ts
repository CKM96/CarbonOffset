import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateProjectDto {
  @IsUUID()
  id: string;

  name?: string;

  description?: string;
}

export class InsertProjectDto {
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  name: string;

  description?: string;
}
