import {Controller, Post, Body, Get, Param, Put, Delete, UploadedFile, UseInterceptors, Query} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('upload_file', {
    storage: diskStorage({
      destination: './uploads/customersFiles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type'), false);
      }
      cb(null, true);
    },
  }))
  create(@Body() data: any, @UploadedFile() file: Express.Multer.File) {
    const filePath = file ? file.path : null;
    return this.customersService.create({ ...data, upload_file: filePath });
  }
  

  @Get()
  async findAll(@Query('search') search?: string) {
    const customers = await this.customersService.findAll(search);
  
    return customers.map(customer => ({
      client_id: customer.id,
      name: customer.name,
      phone: customer.mobile,
      address: customer.details?.address || 'N/A',
      joining_date: customer.createdAt,
    }));
  }
  

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.customersService.findOne(id);
  }

@Put(':id')
@UseInterceptors(FileInterceptor('upload_file', {
  storage: diskStorage({
    destination: './uploads/customersFiles',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  },
}))
update(
  @Param('id') id: number,
  @Body() data: any,
  @UploadedFile() file: Express.Multer.File
) {
  const filePath = file ? file.path : null;

  const parsedData = {
    ...data,
    age: Number(data.age),
    upload_file: filePath,
    details: {
      city: data['details[city]'],
      state: data['details[state]'],
      address: data['details[address]'],
      country: data['details[country]'],
      latitude: parseFloat(data['details[latitude]']),
      longitude: parseFloat(data['details[longitude]']),
      TFN_number: data['details[TFN_number]'],
      license: data['details[license]'],
      proof_of_age: data['details[proof_of_age]'],
      passport: data['details[passport]'],
    },
    documents: {
      TFN: data['documents[TFN]'],
      license: data['documents[license]'],
      proof_of_age: data['documents[proof_of_age]'],
      passport: data['documents[passport]'],
    },
  };

  return this.customersService.update(id, parsedData);
}


  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.customersService.remove(id);
  }
}
