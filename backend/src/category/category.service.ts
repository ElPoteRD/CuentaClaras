import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async createCategory(category: CreateCategoryDto) {
    try {
      const newCategory = await this.prisma.category.create({
        data: {
          name: category.name,
        },
      });
      return newCategory;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async getAllCategory() {
    try {
      const categories = await this.prisma.category.findMany({});
      return categories;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async getCategoryById(id: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The category with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updateCategory = await this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
        },
      });
      if (!updateCategory) {
        throw new NotFoundException(`The category with id ${id} is not found`);
      }
      return updateCategory;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The category with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async removeCategory(id: number) {
    try {
      const deletedCategory = await this.prisma.category.delete({
        where: {
          id,
        },
      });
      if (!deletedCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return deletedCategory;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(`The category with id ${id} is not found`);
      if (error instanceof Error)
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
