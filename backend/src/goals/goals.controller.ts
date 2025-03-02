import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/createGoal')
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiResponse({ status: 201, description: 'Goal created' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, Log in to create a goal',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createGoals(@Body() createGoalDto: CreateGoalDto) {
    return await this.goalsService.createGoals(createGoalDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all goals' })
  @ApiResponse({ status: 200, description: 'All goals found' })
  @ApiResponse({ status: 404, description: 'No goals found' })
  async getAllGoals() {
    return await this.goalsService.getAllGoals();
  }
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get goal by id' })
  @ApiResponse({ status: 200, description: 'Goal found' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async getGoalById(@Param('id', ParseIntPipe) id: number) {
    return await this.goalsService.getGoalById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update goal by id' })
  @ApiResponse({ status: 200, description: 'Goal updated' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async updateGoal(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return await this.goalsService.updateGoal(id, updateGoalDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete goal by id' })
  @ApiResponse({ status: 200, description: 'Goal deleted' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  async removeGoal(@Param('id', ParseIntPipe) id: number) {
    return await this.goalsService.removeGoal(id);
  }
}
