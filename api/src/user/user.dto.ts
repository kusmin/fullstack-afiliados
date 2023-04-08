import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ required: false })
  ativo?: boolean;

  @ApiProperty({ required: false })
  perfil?: string[];
}
