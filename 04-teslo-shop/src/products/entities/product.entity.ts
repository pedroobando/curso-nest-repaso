import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  slug: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column('float', { default: 0 })
  price: number;

  @Column({ type: 'text', array: true })
  sizes: string[];

  @Column({ type: 'text' })
  gender: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ type: 'numeric', nullable: false })
  createdAt: number;

  @Column({ type: 'numeric', nullable: false })
  updatedAt: number;

  // @OneToMany(() => ProductImage, (productImage) => productImage.product, {
  //   cascade: true,
  //   eager: true,
  // })
  // images?: ProductImage[];

  // @ManyToOne(() => User, (user) => user.product, { eager: true })
  // user: User;

  @BeforeInsert()
  checkSlugInsert(): void {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');

    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }

  @BeforeUpdate()
  checkSlugUpdate(): void {
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');

    this.updatedAt = new Date().getTime();
  }
}
