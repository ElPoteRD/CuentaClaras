import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOpinionDto } from './dto/create-opinion.dto';
import { UpdateOpinionDto } from './dto/update-opinion.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class OpinionsService {
  constructor(private prisma: PrismaService) {}
  async createOpinion(createOpinionDto: CreateOpinionDto) {
    try {
      const opinion = await this.prisma.opinions.create({
        data: {
          opinion: createOpinionDto.opinion,
          rating: createOpinionDto.rating,
          userId: createOpinionDto.userId,
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
        },
      });
      return opinion;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async getAllOpinion() {
    try {
      const opinions = await this.prisma.opinions.findMany({});
      return opinions;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async getOpinionById(id: number) {
    try {
      const opinion = await this.prisma.opinions.findFirst({
        where: { id },
      });
      if (!opinion) {
        throw new HttpException('Opinion not found', HttpStatus.NOT_FOUND);
      }
      return opinion;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The opinion with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async updateOpinion(id: number, updateOpinionDto: UpdateOpinionDto) {
    try {
      const updateOpinion = await this.prisma.opinions.update({
        where: { id },
        data: {
          opinion: updateOpinionDto.opinion,
          rating: updateOpinionDto.rating,
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
        },
      });
      if (!updateOpinion) {
        throw new NotFoundException(`The opinion with id ${id} is not found`);
      }
      return updateOpinion;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The opinion with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async removeOpinion(id: number) {
    try {
      const removeOpinion = await this.prisma.opinions.delete({
        where: {
          id,
        },
      });
      if (!removeOpinion) {
        throw new HttpException('Opinion not found', HttpStatus.NOT_FOUND);
      }
      return removeOpinion;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The opinion with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
