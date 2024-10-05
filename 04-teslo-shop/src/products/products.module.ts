import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Product, ProductImage])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
