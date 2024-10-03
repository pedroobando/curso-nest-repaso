import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto, UpdateProductDto } from './dto/inputs';

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
      return { ...newProduct, checkSlugInsert: Product.prototype.checkSlugInsert };
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDBExeptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
