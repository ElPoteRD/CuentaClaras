import { ApiProperty } from "@nestjs/swagger";
import { CurrencyType, GoalStatus } from "@prisma/client";
import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class UpdateGoalDto {
      @ApiProperty({
        description: 'The name of the goal',
        type: String,
      })
      @IsString()
      @MaxLength(250)
      name: string;
      @ApiProperty({
        description: 'The description of the goal',
        type: String,
      })
      @IsString()
      description: string;
      @ApiProperty({
        description: 'The type of the goal',
        type: String,
      })
      @IsString()
      currentType: CurrencyType;
      @ApiProperty({
        description: 'The target date of the goal',
        type: Date,
      })
      @IsDate()
      targetDate: Date;
      @ApiProperty({
        description: 'The status of the goal',
        type: String,
      })
      @IsString()
      @IsNotEmpty()
      status: GoalStatus;
}
