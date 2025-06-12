import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuggestionSupplier } from 'src/entities/suggestion-supplier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuggestionSupplierService {
  constructor(
    @InjectRepository(SuggestionSupplier)
    private readonly repo: Repository<SuggestionSupplier>,
  ) {}

  create(data: Partial<SuggestionSupplier>) {
    const suggestion = this.repo.create(data);
    return this.repo.save(suggestion);
  }

  findAll() {
    return this.repo.find({ relations: ['details'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['details'],
    });
  }

  async update(id: number, data: Partial<SuggestionSupplier>) {
    const suggestion = await this.repo.findOne({ where: { id } });
    if (!suggestion) throw new NotFoundException('Supplier not found');
    Object.assign(suggestion, data);
    return this.repo.save(suggestion);
  }

  async remove(id: number) {
    const suggestion = await this.repo.findOne({ where: { id } });
    if (!suggestion) throw new NotFoundException('Supplier not found');
    return this.repo.remove(suggestion);
  }
}
