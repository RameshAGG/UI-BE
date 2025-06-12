import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuggestionItem } from '../entities/suggestion.item.entity';
import { ApiService } from 'src/common/crud/api.service';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class SuggestionItemService extends ApiService<SuggestionItem> {
  constructor(
    @InjectRepository(SuggestionItem)
    repository: Repository<SuggestionItem>,
  ) {
    super(repository);
  }

  async create(data: Partial<SuggestionItem>): Promise<ApiResponse<SuggestionItem>> {
    return super.create(data);
  }

  async findAll(params?: {
    offset?: number;
    limit?: number;
    searchInput?: string;
    sortField?: string;
    sortOrder?: number;
  }): Promise<ApiResponse<SuggestionItem[]>> {
    return super.findAll(params);
  }

  async findOne(id: string): Promise<ApiResponse<SuggestionItem>> {
    return super.findOne(id);
  }

  async update(id: string, data: Partial<SuggestionItem>): Promise<ApiResponse<SuggestionItem>> {
    return super.update(id, data);
  }

  async remove(id: string): Promise<ApiResponse<SuggestionItem>> {
    return super.delete(id);
  }
}
