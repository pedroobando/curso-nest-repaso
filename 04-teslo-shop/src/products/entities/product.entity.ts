import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: false })
  @Index({ unique: true })
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

  tagsentry: string;

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
    this.title = this.title.trim();
    this.description = this.description ? this.description.trim() : this.description;

    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');

    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }

  @BeforeUpdate()
  checkSlugUpdate(): void {
    this.title = this.title.trim();
    this.description = this.description ? this.description.trim() : this.description;

    this.slug = this.slug.trim().toLowerCase().replaceAll(' ', '_').replaceAll("'", '');

    this.updatedAt = new Date().getTime();
  }
}
