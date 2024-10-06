import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data-teslo';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,

    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,

    // private readonly bcryptService: BCryptAdapter,
  ) {}

  async runSeed(): Promise<any> {
    // await this.deleteTable();

    // const user = await this.insertUsers();

    await this.insertNewProduct();
    return { ok: 'RUNNING SEED' };
  }

  // private async deleteTable() {
  //   await this.productService.deleteAllProducts();

  //   const queryBuilder = this.userRepository.createQueryBuilder();
  //   await queryBuilder.delete().where({}).execute();
  // }

  // private async insertUsers() {
  //   const seedUser = initialData.users;

  //   const users: User[] = [];

  //   seedUser.forEach((user) => {
  //     user.password = this.bcryptService.hash(user.password.trim());
  //     users.push(this.userRepository.create(user));
  //   });

  //   const dbUsers = await this.userRepository.save(seedUser);

  //   return dbUsers[0];
  // }

  private async insertNewProduct() {
    if (process.env.NODE_ENV !== 'dev') {
      throw new BadRequestException(`Esta accion solo puede ser ejecutada en desarrollo.`);
    }

    this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromise = [];
    products.forEach((product) => {
      insertPromise.push(this.productService.create(product));
    });

    await Promise.all(insertPromise);
  }
}
