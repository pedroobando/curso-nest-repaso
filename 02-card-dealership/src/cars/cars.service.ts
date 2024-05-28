import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto } from './dtos';
import { updateCarDto } from './dtos/update-car.dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [];

  findAll() {
    return this.cars;
  }

  findOneById(id: string) {
    const tCar = this.cars.find((car) => car.id == id);
    if (!tCar) throw new NotFoundException(`Car with id: ${id} not found`);
    return tCar;
  }

  create(createCarDto: CreateCarDto) {
    const carNew: Car = { id: uuid(), ...createCarDto };
    this.cars.push(carNew);
    return carNew;
  }

  update(id: string, updateCarDto: updateCarDto) {
    let carDB = this.findOneById(id);

    this.cars = this.cars.map((car) => {
      if (car.id == id) {
        carDB = { ...carDB, ...updateCarDto, id };
        return carDB;
      }
      return car;
    });
    return carDB;
  }

  delete(id: string) {
    const carDB = this.findOneById(id);
    this.cars = this.cars.filter((car) => car.id !== carDB.id);
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
