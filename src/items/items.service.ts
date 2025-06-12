import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from 'src/entities/item.entity';
import { ItemDetails } from 'src/entities/item-details.entity';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(ItemDetails)
    private readonly itemDetailsRepository: Repository<ItemDetails>
  ) {}

  // CREATE - Updated to include groups and subGroups
  async create(data: any): Promise<ApiResponse<Item>> {
    try {
      // Validate required fields
      if (!data.item_name) {
        return {
          success: false,
          data: null,
          message: 'Item name is required',
          statusCode: 400,
        };
      }

      const {
        item_name, uom, pack_size, erp_code, supplier_id, customer, item_code,
        item_grade, item_colour, car_model, hsn, gst, rate,
        maintain_stock, stock_control, Qc_stock_control, wp_stock_control, qc_requried, active,
        item_group_id, item_subgroup_id
      } = data;

      const item = this.itemRepository.create({
        item_name, uom, pack_size, erp_code, item_code,
        item_group_id, item_subgroup_id,
        supplier: supplier_id ? { id: supplier_id } : null
      } as Partial<Item>);

      const details = this.itemDetailsRepository.create({
        item_grade, item_colour, car_model, hsn, gst, rate,
        maintain_stock, stock_control, Qc_stock_control, wp_stock_control, qc_requried, active,
      });

      details.item = item;
      item.details = details;

      const savedItem = await this.itemRepository.save(item);

      // Fetch the saved item with all relations including groups and subGroups
      const completeItem = await this.itemRepository.findOne({
        where: { id: savedItem.id },
        relations: [
          'details',
          'supplier',
          'itemGroup',
          'itemSubGroup'
        ]
      });

      return {
        success: true,
        data: completeItem,
        message: 'Item created successfully',
        statusCode: 201,
      };
    } catch (error) {
      console.error('Error creating item:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Error creating item',
        statusCode: 500,
      };
    }
  }

  // FIND ALL - Updated to include groups and subGroups
  async findAll(): Promise<ApiResponse<Item[]>> {
    try {
      const items = await this.itemRepository.find({
        relations: [
          'details',
          'supplier',
          'itemGroup',
          'itemSubGroup'
        ],
      });

      return {
        success: true,
        data: items,
        message: 'Items fetched successfully',
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error fetching items:', error);
      return {
        success: false,
        data: null,
        message: 'Error fetching items',
        statusCode: 500,
      };
    }
  }

  // FIND ONE - Updated to include groups and subGroups
  async findOne(id: string): Promise<ApiResponse<Item>> {
    try {
      const item = await this.itemRepository.findOne({
        where: { id: +id },
        relations: [
          'details',
          'supplier',
          'itemGroup',
          'itemSubGroup'
        ],
      });

      if (!item) {
        return {
          success: false,
          data: null,
          message: 'Item not found',
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: item,
        message: 'Item fetched successfully',
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error fetching item:', error);
      return {
        success: false,
        data: null,
        message: 'Error fetching item',
        statusCode: 500,
      };
    }
  }

  // UPDATE - Updated to include groups and subGroups
  async update(id: string, data: any): Promise<ApiResponse<Item>> {
    try {
      const item = await this.itemRepository.findOne({
        where: { id: +id },
        relations: [
          'details',
          'supplier',
          'itemGroup',
          'itemSubGroup'
        ],
      });

      if (!item) {
        return {
          success: false,
          data: null,
          message: 'Item not found',
          statusCode: 404,
        };
      }

      // Handle supplier update if provided
      if (data.supplier_id !== undefined) {
        item.supplier = data.supplier_id ? { id: data.supplier_id } as any : null;
        delete data.supplier_id;
      }

      // Update item fields
      const { item_grade, item_colour, car_model, hsn, gst, rate,
              maintain_stock, stock_control, Qc_stock_control, wp_stock_control, 
              qc_requried, active, ...itemData } = data;

      this.itemRepository.merge(item, itemData);

      // Update item details if provided
      if (item.details && (item_grade !== undefined || item_colour !== undefined || 
          car_model !== undefined || hsn !== undefined || gst !== undefined || 
          rate !== undefined || maintain_stock !== undefined || 
          stock_control !== undefined || Qc_stock_control !== undefined || 
          wp_stock_control !== undefined || qc_requried !== undefined || 
          active !== undefined)) {
        
        const detailsUpdate = {
          item_grade, item_colour, car_model, hsn, gst, rate,
          maintain_stock, stock_control, Qc_stock_control, wp_stock_control, 
          qc_requried, active
        };

        // Remove undefined values
        Object.keys(detailsUpdate).forEach(key => 
          detailsUpdate[key] === undefined && delete detailsUpdate[key]
        );

        this.itemDetailsRepository.merge(item.details, detailsUpdate);
      }

      const savedItem = await this.itemRepository.save(item);

      // Fetch updated item with all relations
      const updatedItem = await this.itemRepository.findOne({
        where: { id: savedItem.id },
        relations: [
          'details',
          'supplier',
          'itemGroup',
          'itemSubGroup'
        ]
      });

      return {
        success: true,
        data: updatedItem,
        message: 'Item updated successfully',
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error updating item:', error);
      return {
        success: false,
        data: null,
        message: 'Error updating item',
        statusCode: 500,
      };
    }
  }

  // DELETE - Updated to include groups and subGroups
  async remove(id: string): Promise<ApiResponse<Item>> {
    try {
      const item = await this.itemRepository.findOne({
        where: { id: +id },
        relations: [
          'details',
          'supplier',
          'itemGroup',
          'itemSubGroup'
        ],
      });

      if (!item) {
        return {
          success: false,
          data: null,
          message: 'Item not found',
          statusCode: 404,
        };
      }

      await this.itemRepository.remove(item);

      return {
        success: true,
        data: item,
        message: 'Item deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error deleting item:', error);
      return {
        success: false,
        data: null,
        message: 'Error deleting item',
        statusCode: 500,
      };
    }
  }
}