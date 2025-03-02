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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/createCategory')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, Log in to create a category',
  })
  async create(@Body() data: CreateCategoryDto) {
    return await this.categoryService.createCategory(data);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'All categories found' })
  @ApiResponse({ status: 404, description: 'No categories found' })
  async getAllCategory() {
    return await this.categoryService.getAllCategory();
  }
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getCategoryById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update category by id' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async removeCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.removeCategory(id);
  }
}
