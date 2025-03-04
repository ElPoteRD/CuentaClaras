import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { CreateOpinionDto } from './dto/create-opinion.dto';
import { UpdateOpinionDto } from './dto/update-opinion.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('opinions')
export class OpinionsController {
  constructor(private readonly opinionsService: OpinionsService) {}
  @Post('/createOpinion')
  @ApiOperation({ summary: 'create opinion by id' })
  @ApiResponse({ status: 200, description: 'Opinion updated' })
  @ApiResponse({ status: 404, description: 'Opinion not found' })
  async createOpinion(@Body() createOpinionDto: CreateOpinionDto) {
    return await this.opinionsService.createOpinion(createOpinionDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all opinion' })
  @ApiResponse({ status: 200, description: 'All opinion found' })
  @ApiResponse({ status: 404, description: 'No opinion found' })
  async getAllOpinion() {
    return await this.opinionsService.getAllOpinion();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'get opinion by id' })
  @ApiResponse({ status: 200, description: 'Opinion found' })
  @ApiResponse({ status: 404, description: 'Opinion not found' })
  async getOpinionById(@Param('id', ParseIntPipe) id: number) {
    return await this.opinionsService.getOpinionById(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'update opinion by id' })
  @ApiResponse({ status: 200, description: 'Opinion updated' })
  @ApiResponse({ status: 404, description: 'Opinion not found' })
  async updateOpinion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOpinionDto: UpdateOpinionDto,
  ) {
    return await this.opinionsService.updateOpinion(id, updateOpinionDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'delete opinion by id' })
  @ApiResponse({ status: 200, description: 'Opinion deleted' })
  @ApiResponse({ status: 404, description: 'Opinion not found' })
  async removeOpinion(@Param('id', ParseIntPipe) id: number) {
    return await this.opinionsService.removeOpinion(id);
  }
}
