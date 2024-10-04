import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto, UpdateProductDto } from './dto/inputs';
import { PaginationSearchArgs } from './dto/args';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private defaultLimit: number;
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // @InjectRepository(ProductImage)
    // private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { images = [], ...productDetails } = createProductDto;
    try {
      const product = this.productRepository.create({
        ...productDetails,
        // user,
        // images: images.map((image) => this.productImageRepository.create({ url: image })),
      });
      const newProduct = await this.productRepository.save(product);
      return newProduct;
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findAll(paginationArgs: PaginationSearchArgs): Promise<Product[]> {
    // const { limit, offset, search } = paginationArgs;

    const { limit = 10, offset = 0, title = undefined, gender = undefined, size = undefined } = paginationArgs;

    try {
      let productBuilder = this.productRepository.createQueryBuilder();

      if (title) productBuilder = productBuilder.where('LOWER(title) =:title', { title: title.toLowerCase() });
      if (gender) productBuilder = productBuilder.orWhere('gender =:gender', { gender: gender.toLowerCase() });
      productBuilder = productBuilder.skip(offset).take(limit).addOrderBy('title', 'ASC');

      let products = await productBuilder.getMany();

      return products;
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findOne(term: string): Promise<Product> {
    let product: Product;
    try {
      if (isUUID(term, '4')) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder
          .where('LOWER(title) =:title or slug =:slug', {
            title: term.toLowerCase(),
            slug: term.toLowerCase(),
          })
          // .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne();
      }
      // not found
      if (!product) {
        throw new NotFoundException(`Product with term ${term.toString()} not found`);
      }
      return product;
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findOne(id);
    const productUpd = await this.productRepository.preload({ id, ...updateProductDto });
    try {
      const productReady = await this.productRepository.save(productUpd);
      return productReady;
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async remove(id: string): Promise<Product> {
    const productRemove = await this.findOne(id);
    return await this.productRepository.remove(productRemove);
  }

  private handleDBExeptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if (error.status === 404) {
      throw new NotFoundException(error.message);
    }

    this.logger.error({ ...error });
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
