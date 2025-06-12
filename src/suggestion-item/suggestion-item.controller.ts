import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SuggestionItemService } from './suggestion-item.service';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { SuggestionItem } from '../entities/suggestion.item.entity';

@Controller('suggestion-item')
export class SuggestionItemController {
  constructor(private readonly suggestionItemService: SuggestionItemService) {}

  @Post()
  async create(@Body() data: Partial<SuggestionItem>): Promise<ApiResponse<SuggestionItem>> {
    return this.suggestionItemService.create(data);
  }

  @Get()
  async findAll(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('searchInput') searchInput?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: number,
  ): Promise<ApiResponse<SuggestionItem[]>> {
    return this.suggestionItemService.findAll({
      offset,
      limit,
      searchInput,
      sortField,
      sortOrder,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<SuggestionItem>> {
    return this.suggestionItemService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<SuggestionItem>,
  ): Promise<ApiResponse<SuggestionItem>> {
    return this.suggestionItemService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<SuggestionItem>> {
    return this.suggestionItemService.remove(id);
  }
}
