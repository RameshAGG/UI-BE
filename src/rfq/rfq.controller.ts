import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { Response } from 'express';

@Controller('rfq')
export class RfqController {
  constructor(private readonly rfqService: RfqService) { }

  // @Get('download/:purchaseRequestId')
  // async downloadRfq(
  //   @Param('purchaseRequestId') purchaseRequestId: string,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const supplierFiles = await this.rfqService.generateRfqExcelsBySupplier(Number(purchaseRequestId));

  //     if (supplierFiles.length === 0) {
  //       return res.status(404).send('No suppliers found for this purchase request');
  //     }

  //     // Return supplier files info for frontend to handle multiple downloads
  //     res.json({
  //       success: true,
  //       message: `Found ${supplierFiles.length} supplier(s)`,
  //       suppliers: supplierFiles.map(file => ({
  //         supplierId: file.supplierId,
  //         supplierName: file.supplierName,
  //         filename: file.filename,
  //         downloadUrl: `/rfq/download/${purchaseRequestId}/supplier/${file.supplierId}`
  //       }))
  //     });
  //   } catch (error) {
  //     console.error('Error generating RFQ files:', error);
  //     res.status(500).json({ success: false, message: 'Error generating RFQ files' });
  //   }
  // }


  @Get('download/:purchaseRequestId')
  async downloadRfq(
      @Param('purchaseRequestId') purchaseRequestId: string,
      @Res() res: Response,
  ) {
      try {
          const supplierFiles = await this.rfqService.generateRfqExcelsBySupplier(Number(purchaseRequestId));
  
          // Return supplier files info for frontend to handle multiple downloads
          res.json({
              success: true,
              message: `Found ${supplierFiles.length} supplier(s)`,
              suppliers: supplierFiles.map(file => ({
                  supplierId: file.supplierId,
                  supplierName: file.supplierName,
                  filename: file.filename,
                  downloadUrl: `/rfq/download/${purchaseRequestId}/supplier/${file.supplierId}`
              }))
          });
      } catch (error) {
          console.error('Error generating RFQ files:', error);
          if (error.message.includes('No valid suppliers')) {
              res.status(404).json({ 
                  success: false, 
                  message: error.message 
              });
          } else {
              res.status(500).json({ 
                  success: false, 
                  message: 'Error generating RFQ files' 
              });
          }
      }
  }




  // Optional: Individual supplier download endpoint
  @Get('download/:purchaseRequestId/supplier/:supplierId')
  async downloadRfqForSupplier(
    @Param('purchaseRequestId') purchaseRequestId: string,
    @Param('supplierId') supplierId: string,
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.rfqService.generateRfqExcelForSupplier(
        Number(purchaseRequestId),
        Number(supplierId)
      );

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=RFQ_${purchaseRequestId}_Supplier_${supplierId}.xlsx`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating RFQ file for supplier:', error);
      res.status(500).send('Error generating RFQ file');
    }
  }


  @Post('upload/:purchaseRequestId/supplier/:supplierId')
  async uploadRfqData(
    @Param('purchaseRequestId') purchaseRequestId: string,
    @Param('supplierId') supplierId: string,
    @Body() body: { items: any[] },
    @Res() res: Response
  ) {
    try {
      const result = await this.rfqService.processRfqUpload(
        Number(purchaseRequestId),
        Number(supplierId),
        body.items
      );

      return res.status(201).json({
        success: true,
        message: 'Success',
        data: result,
        statusCode: 201
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(400).json({
        success: false,
        message: error.message,
        statusCode: 400
      });
    }
  }

  @Get('data/:purchaseRequestId')
  async getRfqData(
    @Param('purchaseRequestId') purchaseRequestId: string,
    @Res() res: Response
  ) {
    try {
      const rfqData = await this.rfqService.getRfqDataForRequest(
        Number(purchaseRequestId)
      );

      res.json({
        success: true,
        data: rfqData
      });
    } catch (error) {
      console.error('Error fetching RFQ data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching RFQ data'
      });
    }
  }


  // rfq.controller.ts

  @Get('comparative-data/:purchaseRequestId')
  async getComparativeRfqData(
    @Param('purchaseRequestId') purchaseRequestId: string,
    @Res() res: Response
  ) {
    try {
      const comparativeData = await this.rfqService.getComparativeRfqData(
        Number(purchaseRequestId)
      );

      res.json({
        success: true,
        data: comparativeData
      });
    } catch (error) {
      console.error('Error fetching comparative RFQ data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching comparative RFQ data'
      });
    }
  }


  @Delete('rfq/:id')
  async softDelete(@Param('id') id: string) {
    await this.rfqService.softDeleteRfqData(Number(id));
    return { message: 'RFQ data soft deleted successfully' };
  }

  @Post('rfq/:id/restore')
  async restore(@Param('id') id: string) {
    await this.rfqService.restoreRfqData(Number(id));
    return { message: 'RFQ data restored successfully' };
  }
}