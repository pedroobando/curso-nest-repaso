import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
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

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    //* El DatoSource: contiene todos los datos de la conexion a la base de datos, es trabajo a bajo nivel.
    private readonly dataSource: DataSource,

    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createProductDto: CreateProductDto): Promise<any> {
    const { images = [], ...productDetails } = createProductDto;
    try {
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) => this.productImageRepository.create({ url: image })),
        // user,
      });
      const newProduct = await this.productRepository.save(product);
      return { ...newProduct, images };
    } catch (error) {
      this.handleDBExeptions(error);
    }
  }

  async findAll(paginationArgs: PaginationSearchArgs): Promise<any> {
    // const { limit, offset, search } = paginationArgs;

    const { limit = 10, offset = 0, title = undefined, gender = undefined, size = undefined } = paginationArgs;

    try {
      // let productBuilder = this.productRepository.createQueryBuilder();

      // if (title) productBuilder = productBuilder.where('LOWER(title) =:title', { title: title.toLowerCase() });
      // if (gender) productBuilder = productBuilder.orWhere('gender =:gender', { gender: gender.toLowerCase() });
      // productBuilder = productBuilder.skip(offset).take(limit).addOrderBy('title', 'ASC');

      // let products = await productBuilder.getMany();

      const product = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });

      //* Este esta es la respuesta normal, con los id de las imagenes
      // return product;

      //* Este es un codigo aplanado, es decir sin los id de las imagenes
      return product.map((product) => this.onePlain(product));
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
          .leftJoinAndSelect('prod.images', 'prodImages')
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

  async findOnePlain(term: string): Promise<any> {
    const product = await this.findOne(term);
    return this.onePlain(product);
  }

  //* Solo es para aplanar el objeto o cambiarle la forma
  private onePlain(product: Product): any {
    const { images, ...productRest } = product;
    return { productRest, images: images.map((image) => image.url) };
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });

    if (!product) throw new BadRequestException(`Product with id: ${id} not found`);

    //* Create Queryrunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) => this.productImageRepository.create({ url: image }));
      }

      // await this.productRepository.save(product);
      // TODO: Actualiza el usuario, antes de guardar los cambios
      // product.user = user;
      await queryRunner.manager.save(product);
      // TODO: graba la transaccion en db
      await queryRunner.commitTransaction();
      // TODO: libera el queryRunner o coneccion
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExeptions(error);
    }
  }

  async remove(id: string): Promise<Product> {
    const productRemove = await this.findOne(id);
    return await this.productRepository.remove(productRemove);
  }

  async deleteAllProducts(): Promise<any> {
    const queryRemove = await this.productRepository.createQueryBuilder('product');

    try {
      return await queryRemove.delete().where({}).execute();
    } catch (error) {
      this.handleDBExeptions(error);
    }
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
