import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/base.service';
import { ApiService } from 'src/common/crud/api.service';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Item } from 'src/entities/item.entity';
import { PurchaseRequest } from '../entities/purchase-requests.entity';
import { Repository, DataSource } from 'typeorm';
import { PrDetails } from '../entities/pr-details.entity';
import { Supplier } from '../entities/supplier.entity';
import { SuggestionItem } from '../entities/suggestion.item.entity';
import { SuggestionSupplier } from 'src/entities/suggestion-supplier.entity';

interface CreatePurchaseRequestData {
  department: string;
  date_requested: Date;
  status: string;
  items: Array<{
    item_id: number | null;
    is_new_item?: boolean;
    item_name?: string;
    category?: string;
    subcategory?: string;
    item_type: boolean;
    uom?: number;
    item_group_id?: number;
    item_subgroup_id?: number;
    pack_size?: number;
    erp_code?: number;
    item_code?: number;
    supplier: Array<{
      supplier_id: number | null;
      is_new_supplier?: boolean;
      name?: string;
      email?: string;
      mob_num?: number;
      tel_num?: number;
    }>;
  }>;
  suggestion_items?: Array<{
    item_name: string;
    category: string;
    sub_category: string;
  }>;
  suggestion_suppliers?: Array<{
    name: string;
    email: string;
    mob_num: number;
    tel_num: number;
  }>;
}

@Injectable()
// export class PurchaseRequestService  {
    export class PurchaseRequestService extends ApiService<PrDetails> {

    constructor(
        @InjectRepository(PurchaseRequest)
        protected readonly RequestRepository: Repository<PurchaseRequest>,
        @InjectRepository(Item)
        protected readonly ItemsRepository: Repository<Item>,
        @InjectRepository(PrDetails)
        protected readonly prDetailsRepository: Repository<PrDetails>,
        @InjectRepository(Supplier)
        private supplierRepository: Repository<Supplier>,
        @InjectRepository(SuggestionItem)
        private suggestionItemRepository: Repository<SuggestionItem>,
        @InjectRepository(SuggestionSupplier)
        private suggestionSupplierRepository: Repository<SuggestionSupplier>,
        private dataSource: DataSource,
      ) {
        super(prDetailsRepository);
      }

    
      async create(data: Partial<PurchaseRequest>): Promise<ApiResponse<PurchaseRequest>> {
        return super.create(data);
      }
    
      async findAll(): Promise<ApiResponse<PurchaseRequest[]>> {
        return super.findAll();
      }
    
      async findOne(id: string): Promise<ApiResponse<PurchaseRequest>> {
        return super.findOne(id);
      }
    
      async update(id: string, data: Partial<PurchaseRequest>): Promise<ApiResponse<PurchaseRequest>> {
        return super.update(id, data);
      }
    
      async remove(id: string): Promise<ApiResponse<PurchaseRequest>> {
        return super.delete(id);
      }


      async createPurchaseRequest(data: CreatePurchaseRequestData) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
      
        try {
          // Create base purchase request
          const purchaseRequest = new PurchaseRequest();
          const savedPurchaseRequest = await queryRunner.manager.save(purchaseRequest);
      
          const prDetailsPromises: Promise<PrDetails>[] = [];
      
          for (const item of data.items) {
            let itemEntity: Item | null = null;
            let suggestionItem: SuggestionItem | null = null;
      
            if (item.item_id) {
              itemEntity = await this.ItemsRepository.findOne({ where: { id: item.item_id } });
              if (!itemEntity) throw new Error(`Item with ID ${item.item_id} not found`);
            } else {
              // Check existing by name
              itemEntity = await this.ItemsRepository.findOne({ where: { item_name: item.item_name } });
            }
      
            if (!itemEntity) {
              // Create or get suggestion item
              suggestionItem = await this.suggestionItemRepository.findOne({
                where: { item_name: item.item_name },
              });
      
              if (!suggestionItem) {
                suggestionItem = this.suggestionItemRepository.create({
                  item_name: item.item_name,
                  category: item.category,
                  sub_category: item.subcategory,
                });
                suggestionItem = await queryRunner.manager.save(suggestionItem);
              }
            }
      
            for (const supplierData of item.supplier) {
              let supplierEntity: Supplier | null = null;
              let suggestionSupplier: SuggestionSupplier | null = null;
      
              if (supplierData.supplier_id) {
                supplierEntity = await this.supplierRepository.findOne({ where: { id: supplierData.supplier_id } });
                if (!supplierEntity) throw new Error(`Supplier with ID ${supplierData.supplier_id} not found`);
              } else {
                // Check existing by email or name
                supplierEntity = await this.supplierRepository.findOne({
                  where: { email: supplierData.email },
                });
              }
      
              if (!supplierEntity) {
                // Create or get suggestion supplier
                suggestionSupplier = await this.suggestionSupplierRepository.findOne({
                  where: { email: supplierData.email },
                });
      
                if (!suggestionSupplier) {
                  suggestionSupplier = this.suggestionSupplierRepository.create({
                    name: supplierData.name,
                    email: supplierData.email,
                    mob_num: supplierData.mob_num,
                    tel_num: supplierData.tel_num,
                  });
                  suggestionSupplier = await queryRunner.manager.save(suggestionSupplier);
                }
              }
      
              const prDetail = new PrDetails();
              prDetail.department = data.department;
              prDetail.date_requested = data.date_requested;
              prDetail.status = data.status;
              prDetail.item_type = item.item_type;
              prDetail.purchase_request = savedPurchaseRequest;
      
              if (itemEntity) prDetail.item = itemEntity;
              else if (suggestionItem) prDetail.suggestion_item = suggestionItem;
      
              if (supplierEntity) prDetail.supplier = supplierEntity;
              else if (suggestionSupplier) prDetail.suggestion_supplier = suggestionSupplier;
      
              prDetailsPromises.push(queryRunner.manager.save(prDetail));
            }
          }
      
          await Promise.all(prDetailsPromises);
          await queryRunner.commitTransaction();
      
          return {
            success: true,
            data: savedPurchaseRequest,
            message: 'Purchase request created successfully',
            statusCode: 201,
          };
        } catch (err) {
          await queryRunner.rollbackTransaction();
          throw err;
        } finally {
          await queryRunner.release();
        }
      }
      






























      // async createPurchaseRequest(data: CreatePurchaseRequestData) {
      //   const queryRunner = this.dataSource.createQueryRunner();
      //   await queryRunner.connect();
      //   await queryRunner.startTransaction();

      //   try {
      //     // Create purchase request
      //     const purchaseRequest = new PurchaseRequest();
      //     const savedPurchaseRequest = await queryRunner.manager.save(purchaseRequest);

      //     // Create PR details for each item and supplier combination
      //     const prDetailsPromises: Promise<PrDetails>[] = [];

      //     // Handle items
      //     if (data.items) {
      //       for (const item of data.items) {
      //         let itemEntity: Item;

      //         // Handle new item
      //         if (item.is_new_item) {
      //           if (!item.item_name || !item.category || !item.subcategory) {
      //             throw new Error('New item requires name, category, and subcategory');
      //           }

      //           // Create new item with default values for required fields
      //           const newItem = new Item();
      //           newItem.item_name = item.item_name;
      //           newItem.uom = item.uom || 1; // Default UOM
      //           newItem.item_group_id = item.item_group_id || 1; // Default group
      //           newItem.item_subgroup_id = item.item_subgroup_id || 1; // Default subgroup
      //           newItem.pack_size = item.pack_size || 1; // Default pack size
      //           newItem.erp_code = item.erp_code || 0; // Default ERP code
      //           newItem.item_code = item.item_code || 0; // Default item code
                
      //           itemEntity = await queryRunner.manager.save(newItem);
      //         } else {
      //           // Handle existing item
      //           if (!item.item_id) {
      //             throw new Error('Item ID is required for existing items');
      //           }
      //           const foundItem = await this.ItemsRepository.findOne({ where: { id: item.item_id } });
      //           if (!foundItem) {
      //             throw new Error(`Item with ID ${item.item_id} not found`);
      //           }
      //           itemEntity = foundItem;
      //         }

      //         // Handle suppliers for this item
      //         for (const supplierData of item.supplier) {
      //           let supplierEntity: Supplier;

      //           // Handle new supplier
      //           if (supplierData.is_new_supplier) {
      //             if (!supplierData.name || !supplierData.email || !supplierData.mob_num || !supplierData.tel_num) {
      //               throw new Error('New supplier requires name, email, mobile number, and telephone number');
      //             }

      //             // Create new suggestion supplier
      //             const newSuggestionSupplier = new SuggestionSupplier();
      //             newSuggestionSupplier.name = supplierData.name;
      //             newSuggestionSupplier.email = supplierData.email;
      //             newSuggestionSupplier.mob_num = supplierData.mob_num;
      //             newSuggestionSupplier.tel_num = supplierData.tel_num;
                  
      //             // Save to suggestion supplier table
      //             const savedSuggestionSupplier = await queryRunner.manager.save(newSuggestionSupplier);
                  
      //             // Create new supplier from suggestion
      //             const newSupplier = new Supplier();
      //             newSupplier.name = savedSuggestionSupplier.name;
      //             newSupplier.email = savedSuggestionSupplier.email;
      //             newSupplier.mob_num = savedSuggestionSupplier.mob_num;
      //             newSupplier.tel_num = savedSuggestionSupplier.tel_num;
      //             supplierEntity = await queryRunner.manager.save(newSupplier);
      //           } else {
      //             // Handle existing supplier
      //             if (!supplierData.supplier_id) {
      //               throw new Error('Supplier ID is required for existing suppliers');
      //             }
      //             const foundSupplier = await this.supplierRepository.findOne({ 
      //               where: { id: supplierData.supplier_id } 
      //             });
      //             if (!foundSupplier) {
      //               throw new Error(`Supplier with ID ${supplierData.supplier_id} not found`);
      //             }
      //             supplierEntity = foundSupplier;
      //           }

      //           // Create PR detail
      //           const prDetail = new PrDetails();
      //           prDetail.department = data.department;
      //           prDetail.date_requested = data.date_requested;
      //           prDetail.status = data.status;
      //           prDetail.item_type = item.item_type;
      //           prDetail.item = itemEntity;
      //           prDetail.supplier = supplierEntity;
      //           prDetail.purchase_request = savedPurchaseRequest;
                
      //           prDetailsPromises.push(queryRunner.manager.save(prDetail));
      //         }
      //       }
      //     }

      //     // Handle suggestion items - insert into suggestion_item_master table
      //     if (data.suggestion_items) {
      //       const suggestionItemPromises: Promise<SuggestionItem>[] = [];
            
      //       for (const suggestionItemData of data.suggestion_items) {
      //         const suggestionItem = new SuggestionItem();
      //         suggestionItem.item_name = suggestionItemData.item_name;
      //         suggestionItem.category = suggestionItemData.category;
      //         suggestionItem.sub_category = suggestionItemData.sub_category;
              
      //         suggestionItemPromises.push(queryRunner.manager.save(suggestionItem));
      //       }

      //       await Promise.all(suggestionItemPromises);
      //     }

      //     await Promise.all(prDetailsPromises);
      //     await queryRunner.commitTransaction();

      //     return {
      //       success: true,
      //       data: savedPurchaseRequest,
      //       message: 'Purchase request created successfully',
      //       statusCode: 201
      //     };
      //   } catch (err) {
      //     await queryRunner.rollbackTransaction();
      //     throw err;
      //   } finally {
      //     await queryRunner.release();
      //   }
      // }
}
