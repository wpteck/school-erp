import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string; // jaise "Class 5"

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  section: string; // jaise "A"
}