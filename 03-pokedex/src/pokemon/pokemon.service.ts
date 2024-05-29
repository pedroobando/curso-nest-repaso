import { Model, isValidObjectId } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon, PokemonDocument } from './entities/pokemon.entity';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { PaginationDto } from 'src/common/dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private readonly defaulLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>,
    private readonly configService: ConfigService,
  ) {
    this.defaulLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const createdProkemon = await this.pokemonModel.create(createPokemonDto);
      return createdProkemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { limit = this.defaulLimit, offset = 0 } = paginationDto;

    return await this.pokemonModel
      .find({})
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select(['-__v']);
  }

  async findOne(term: string): Promise<PokemonDocument> {
    let pokemon: PokemonDocument;

    // Por no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // Por MongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Por Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    // not found
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name, no "${term}" not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.delete();
    const removePokemon = await this.pokemonModel.findByIdAndDelete(id);
    if (!removePokemon) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
  }

  private handleExceptions(error: any): void {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon in db - Check server logs`,
    );
  }
}
