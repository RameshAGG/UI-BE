import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemPrice } from 'src/entities/item-price.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Supplier } from 'src/entities/supplier.entity';
import { Item } from 'src/entities/item.entity';

@Injectable()
export class ItemPriceService {
  constructor(
    @InjectRepository(ItemPrice)
    private readonly itemPriceRepository: Repository<ItemPrice>,

    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {}

  // async findAll(): Promise<ApiResponse<ItemPrice[]>> {
  //   const prices = await this.itemPriceRepository.find({
  //     relations: ['supplier', 'item'],
  //   });
  //   return {
  //     success: true,
  //     data: prices,
  //     message: 'Item prices fetched successfully',
  //     statusCode: 200,
  //   };
  // }


  async findAll(): Promise<ApiResponse<ItemPrice[]>> {
    const prices = await this.itemPriceRepository.find({
      relations: [
        'supplier', 
        'item',
        'item.itemGroup', // Make sure these match your entity property names
        'item.itemSubGroup'
      ],
    });
    
    return {
      success: true,
      data: prices,
      message: 'Item prices fetched successfully',
      statusCode: 200,
    };
  }
  

  async findOne(id: number): Promise<ApiResponse<ItemPrice>> {
    const price = await this.itemPriceRepository.findOne({
      where: { id },
      relations: ['supplier', 'item'],
    });

    if (!price) {
      return {
        success: false,
        data: null,
        message: 'Item price not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: price,
      message: 'Item price fetched successfully',
      statusCode: 200,
    };
  }

  async create(data: Partial<ItemPrice> & { supplier_id?: number; items_id?: number }): Promise<ApiResponse<ItemPrice>> {
    const itemPrice = new ItemPrice();
  
    itemPrice.company = data.company!;
    itemPrice.unit = data.unit!;
    itemPrice.effective_date = data.effective_date!;
    itemPrice.rate = data.rate!;
    itemPrice.default_user = data.default_user!;
  
    // Fetch and assign supplier
    if (data.supplier_id) {
      const supplier = await this.supplierRepository.findOne({ where: { id: data.supplier_id } });
      if (!supplier) {
        return {
          success: false,
          data: null,
          message: 'Supplier not found',
          statusCode: 404,
        };
      }
      itemPrice.supplier = supplier;
    }
  
    // Fetch and assign item
    if (data.items_id) {
      const item = await this.itemRepository.findOne({ where: { id: data.items_id } });
      if (!item) {
        return {
          success: false,
          data: null,
          message: 'Item not found',
          statusCode: 404,
        };
      }
      itemPrice.item = item;
    }
  
    const saved = await this.itemPriceRepository.save(itemPrice);
  
    return {
      success: true,
      data: saved,
      message: 'Item price created successfully',
      statusCode: 201,
    };
  }
  

  async update(id: number, data: Partial<ItemPrice>): Promise<ApiResponse<ItemPrice>> {
    const price = await this.itemPriceRepository.findOne({ where: { id } });

    if (!price) {
      return {
        success: false,
        data: null,
        message: 'Item price not found',
        statusCode: 404,
      };
    }

    const updated = this.itemPriceRepository.merge(price, data);
    const saved = await this.itemPriceRepository.save(updated);

    return {
      success: true,
      data: saved,
      message: 'Item price updated successfully',
      statusCode: 200,
    };
  }

  async remove(id: number): Promise<ApiResponse<ItemPrice>> {
    const price = await this.itemPriceRepository.findOne({ where: { id } });

    if (!price) {
      return {
        success: false,
        data: null,
        message: 'Item price not found',
        statusCode: 404,
      };
    }

    await this.itemPriceRepository.remove(price);

    return {
      success: true,
      data: price,
      message: 'Item price deleted successfully',
      statusCode: 200,
    };
  }
}
