import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { BaseService } from 'src/common/base/base.service';
import { ApiService } from 'src/common/crud/api.service';
import { ApiResponse, ApiResponses } from 'src/common/interfaces/api-response.interface';
import { Item } from 'src/entities/item.entity';
import { PurchaseRequest } from '../entities/purchase-requests.entity';
import { Repository, DataSource, ILike, FindManyOptions } from 'typeorm';
import { PrDetails } from '../entities/pr-details.entity';
import { Supplier } from '../entities/supplier.entity';
import { SuggestionItem } from '../entities/suggestion.item.entity';
import { SuggestionSupplier } from 'src/entities/suggestion-supplier.entity';
import { FindOptionsWhere } from 'typeorm';

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
    quantity?: number;
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

  // async findAll(): Promise<ApiResponse<PurchaseRequest[]>> {
  //   return super.findAll();
  // }


  // async findAll(): Promise<ApiResponse<any[]>> {
  //   try {
  //     // Get all PR details with relations
  //     const prDetails = await this.prDetailsRepository.find({
  //       relations: [
  //         'purchase_request',
  //         'item',
  //         'supplier',
  //         'suggestion_item',
  //         'suggestion_supplier'
  //       ],
  //       order: {
  //         purchase_request: { id: 'ASC' }
  //       }
  //     });

  //     // Group by purchase request
  //     const grouped = prDetails.reduce((acc, detail) => {
  //       const prId = detail.purchase_request.id;
  //       if (!acc[prId]) {
  //         acc[prId] = {
  //           id: detail.id,
  //           department: detail.department,
  //           date_requested: detail.date_requested,
  //           status: detail.status,
  //           item_type: detail.item_type,
  //           purchase_request_id: prId,
  //           items: [],
  //           suppliers: [],
  //           item_ids: new Set(),
  //           supplier_ids: new Set()
  //         };
  //       }

  //       // Add item information
  //       if (detail.item && !acc[prId].item_ids.has(detail.item.id)) {
  //         acc[prId].items.push({
  //           id: detail.item.id,
  //           name: detail.item.item_name,
  //           type: 'existing',
  //           // category: detail.item.category,
  //           // subcategory: detail.item.subcategory
  //         });
  //         acc[prId].item_ids.add(detail.item.id);
  //       } else if (detail.suggestion_item && !acc[prId].item_ids.has(detail.suggestion_item.id)) {
  //         acc[prId].items.push({
  //           id: detail.suggestion_item.id,
  //           name: detail.suggestion_item.item_name,
  //           type: 'suggested',
  //           category: detail.suggestion_item.category,
  //           subcategory: detail.suggestion_item.sub_category
  //         });
  //         acc[prId].item_ids.add(detail.suggestion_item.id);
  //       }

  //       // Add supplier information
  //       if (detail.supplier && !acc[prId].supplier_ids.has(detail.supplier.id)) {
  //         acc[prId].suppliers.push({
  //           id: detail.supplier.id,
  //           name: detail.supplier.name,
  //           type: 'existing',
  //           email: detail.supplier.email,
  //           mob_num: detail.supplier.mob_num
  //         });
  //         acc[prId].supplier_ids.add(detail.supplier.id);
  //       } else if (detail.suggestion_supplier && !acc[prId].supplier_ids.has(detail.suggestion_supplier.id)) {
  //         acc[prId].suppliers.push({
  //           id: detail.suggestion_supplier.id,
  //           name: detail.suggestion_supplier.name,
  //           type: 'suggested',
  //           email: detail.suggestion_supplier.email,
  //           mob_num: detail.suggestion_supplier.mob_num
  //         });
  //         acc[prId].supplier_ids.add(detail.suggestion_supplier.id);
  //       }

  //       return acc;
  //     }, {});

  //     // Transform the grouped data
  //     const result = Object.values(grouped).map((group: any) => ({
  //       id: group.id,
  //       department: group.department,
  //       date_requested: group.date_requested,
  //       status: group.status,
  //       item_type: group.item_type,
  //       purchase_request_id: group.purchase_request_id,

  //       // items: group.items,
  //       // suppliers: group.suppliers,
  //       total_items: group.items.length,
  //       total_suppliers: group.suppliers.length,
  //     }));

  //     return {
  //       success: true,
  //       message: 'Success',
  //       data: result,
  //       statusCode: 200
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: error.message,
  //       data: null,
  //       statusCode: 500
  //     };
  //   }
  // }


  async findAll(query?: {
    searchInput?: string;
    offset?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: number;
  }): Promise<ApiResponse<any[]>> {
    try {
      // Build the base query options for PurchaseRequest
      const options: FindManyOptions<PurchaseRequest> = {
        relations: {
          pr_details: {
            item: true,
            supplier: true,
            suggestion_item: true,
            suggestion_supplier: true
          }
        },
        order: {
          id: 'ASC'
        },
        skip: query?.offset || 0,
        take: query?.limit || 10
      };

      // Apply search if provided
      if (query?.searchInput) {
        options.where = [
          {
            pr_details: {
              department: ILike(`%${query.searchInput}%`)
            }
          },
          {
            pr_details: {
              status: ILike(`%${query.searchInput}%`)
            }
          },
          {
            pr_details: {
              item: { item_name: ILike(`%${query.searchInput}%`) }
            }
          },
          {
            pr_details: {
              suggestion_item: { item_name: ILike(`%${query.searchInput}%`) }
            }
          },
          {
            pr_details: {
              supplier: { name: ILike(`%${query.searchInput}%`) }
            }
          },
          {
            pr_details: {
              suggestion_supplier: { name: ILike(`%${query.searchInput}%`) }
            }
          }
        ] as FindOptionsWhere<PurchaseRequest>[];
      }

      // Apply sorting if provided
      if (query?.sortField) {
        const order: 'ASC' | 'DESC' = query.sortOrder === -1 ? 'DESC' : 'ASC';

        if (query.sortField.includes('pr_details.')) {
          const field = query.sortField.replace('pr_details.', '');
          options.order = {
            pr_details: {
              [field]: order
            }
          };
        } else {
          options.order = {
            [query.sortField]: order
          };
        }
      }

      // Get all PurchaseRequests with relations
      const [purchaseRequests, totalCount] = await this.RequestRepository.findAndCount(options);

      // Process each purchase request to group the details
      const result = purchaseRequests.map(purchaseRequest => {
        if (!purchaseRequest.pr_details || purchaseRequest.pr_details.length === 0) {
          return {
            id: purchaseRequest.id,
            department: null,
            date_requested: null,
            status: null,
            item_type: null,
            purchase_request_id: purchaseRequest.id,
            total_items: 0,
            total_suppliers: 0,
            _pagination: {
              total: totalCount,
              offset: query?.offset || 0,
              limit: query?.limit || 10
            }
          };
        }

        const firstDetail = purchaseRequest.pr_details[0];
        const items = new Set<number>();
        const suppliers = new Set<number>();

        purchaseRequest.pr_details.forEach(detail => {
          if (detail.item) items.add(detail.item.id);
          if (detail.suggestion_item) items.add(detail.suggestion_item.id);
          if (detail.supplier) suppliers.add(detail.supplier.id);
          if (detail.suggestion_supplier) suppliers.add(detail.suggestion_supplier.id);
        });

        return {
          id: purchaseRequest.id,
          department: firstDetail.department,
          date_requested: firstDetail.date_requested,
          status: firstDetail.status,
          item_type: firstDetail.item_type,
          purchase_request_id: purchaseRequest.id,
          total_items: items.size,
          total_suppliers: suppliers.size,
          _pagination: {
            total: totalCount,
            offset: query?.offset || 0,
            limit: query?.limit || 10
          }
        };
      });

      return {
        success: true,
        message: 'Success',
        data: result,
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
        statusCode: 500
      };
    }
  }

  
  private createEmptyResponse(
    purchaseRequest: PurchaseRequest,
    totalCount: number,
    offset: number,
    limit: number
  ) {
    return {
      id: purchaseRequest.id,
      department: null,
      date_requested: null,
      status: null,
      item_type: null,
      purchase_request_id: purchaseRequest.id,
      total_items: 0,
      total_suppliers: 0,
      _pagination: {
        total: totalCount,
        offset,
        limit,
        hasMore: offset + limit < totalCount
      }
    };
  }
  
  private countUniqueItemsAndSuppliers(details: PrDetails[]): {
    itemsCount: number;
    suppliersCount: number;
  } {
    const items = new Set<number>();
    const suppliers = new Set<number>();
  
    details.forEach(detail => {
      if (detail.item) items.add(detail.item.id);
      if (detail.suggestion_item) items.add(detail.suggestion_item.id);
      if (detail.supplier) suppliers.add(detail.supplier.id);
      if (detail.suggestion_supplier) suppliers.add(detail.suggestion_supplier.id);
    });
  
    return {
      itemsCount: items.size,
      suppliersCount: suppliers.size
    };
  }
  

  async findOne(id: string): Promise<ApiResponse<any>> {
    try {
      // Get PR details with relations for the specific purchase request
      const prDetails = await this.prDetailsRepository.find({
        where: { purchase_request: { id: parseInt(id) } },
        relations: [
          'purchase_request',
          'item',
          'supplier',
          'suggestion_item',
          'suggestion_supplier'
        ],
        order: { id: 'ASC' }
      });

      if (!prDetails || prDetails.length === 0) {
        return {
          success: false,
          message: 'Purchase request not found',
          data: null,
          statusCode: 404
        };
      }

      // Initialize collections
      const items = new Map<number, any>();
      const suppliers = new Map<number, any>();
      const prCommonData = {
        id: prDetails[0].id,
        department: prDetails[0].department,
        date_requested: prDetails[0].date_requested,
        status: prDetails[0].status,
        item_type: prDetails[0].item_type,
        purchase_request_id: prDetails[0].purchase_request.id
      };

      // Process each detail record
      for (const detail of prDetails) {
        // Handle items
        if (detail.item && !items.has(detail.item.id)) {
          items.set(detail.item.id, {
            id: detail.item.id,
            name: detail.item.item_name,
            type: 'existing',
            quantity: detail.quantity, // Add this line
            // category: detail.item.category,
            // subcategory: detail.item.subcategory,
            uom: detail.item.uom,
            pack_size: detail.item.pack_size
          });
        } else if (detail.suggestion_item && !items.has(detail.suggestion_item.id)) {
          items.set(detail.suggestion_item.id, {
            id: detail.suggestion_item.id,
            name: detail.suggestion_item.item_name,
            type: 'suggested',
            quantity: detail.quantity, // Add this line
            category: detail.suggestion_item.category,
            subcategory: detail.suggestion_item.sub_category,
            uom: null,
            pack_size: null
          });
        }

        // Handle suppliers
        if (detail.supplier && !suppliers.has(detail.supplier.id)) {
          suppliers.set(detail.supplier.id, {
            id: detail.supplier.id,
            name: detail.supplier.name,
            type: 'existing',
            email: detail.supplier.email,
            mob_num: detail.supplier.mob_num,
            tel_num: detail.supplier.tel_num
          });
        } else if (detail.suggestion_supplier && !suppliers.has(detail.suggestion_supplier.id)) {
          suppliers.set(detail.suggestion_supplier.id, {
            id: detail.suggestion_supplier.id,
            name: detail.suggestion_supplier.name,
            type: 'suggested',
            email: detail.suggestion_supplier.email,
            mob_num: detail.suggestion_supplier.mob_num,
            tel_num: detail.suggestion_supplier.tel_num
          });
        }
      }

      // Build the result object
      const result = {
        ...prCommonData,
        total_items: items.size,
        total_suppliers: suppliers.size,
        items: Array.from(items.values()),
        suppliers: Array.from(suppliers.values()),
        // Include additional PR metadata if needed
        // created_at: prDetails[0].purchase_request.created_at,
        // updated_at: prDetails[0].purchase_request.updated_at
      };

      return {
        success: true,
        message: 'Success',
        data: result,
        statusCode: 200
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
        statusCode: 500
      };
    }
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
          prDetail.quantity = item.quantity || 1; // Add this line to set quantity

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

}
