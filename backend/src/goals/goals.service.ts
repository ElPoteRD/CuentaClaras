import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}
  async createGoals(createGoalDto: CreateGoalDto) {
    try {
      const targetDate = new Date(createGoalDto.targetDate);
      if (targetDate < new Date()) {
        throw new HttpException(
          'La fecha objetivo debe ser futura',
          HttpStatus.BAD_REQUEST,
        );
      }

      const goal = await this.prisma.goal.create({
        data: {
          name: createGoalDto.name,
          description: createGoalDto.description,
          targetAmount: createGoalDto.targetAmount,
          currentType: createGoalDto.currentType,
          targetDate,
          status: createGoalDto.status,
          userId: createGoalDto.userId,
          accountId: createGoalDto.accountId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              registrationDate: true,
            },
          },
          account: {
            select: {
              id: true,
              name: true,
              initialBalance: true,
            },
          },
        },
      });
      return goal;
    } catch (error) {}
  }

  async getAllGoals() {
    try {
      const goals = await this.prisma.goal.findMany({});
      return goals;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getGoalById(id: number) {
    try {
      const goal = await this.prisma.goal.findUnique({ where: { id } });
      if (!goal) {
        throw new HttpException('Goal not found', HttpStatus.NOT_FOUND);
      }
      return goal;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The goal with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async updateGoal(id: number, updateGoalDto: UpdateGoalDto) {
    try {
      const goal = await this.prisma.goal.update({
        where: { id },
        data: updateGoalDto,
      });
      if (!goal) {
        throw new NotFoundException(`The goal with id ${id} is not found`);
      }
      return goal;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The goal with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async removeGoal(id: number) {
    try {
      const goal = await this.prisma.goal.delete({ where: { id } });
      if (!goal) {
        throw new NotFoundException(`The goal with id ${id} is not found`);
      }
      if (!goal) {
        throw new HttpException('Goal not found', HttpStatus.NOT_FOUND);
      }
      return goal;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The goal with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
