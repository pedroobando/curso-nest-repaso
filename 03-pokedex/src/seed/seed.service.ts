import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters';
import { Pokemon, PokemonDocument } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private enviroment: string;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>,
    private readonly http: AxiosAdapter,
    private readonly configService: ConfigService,
  ) {
    this.enviroment = configService.get('enviroment');
  }

  async executeSeed() {
    if (this.enviroment !== 'dev') {
      throw new BadRequestException('This endpoint is for use in development');
    }
    const { results } = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonInserted: { name: string; no: number }[] = results.map(
      ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
        return { name, no };
      },
    );

    await this.pokemonModel.deleteMany();
    const totInserted = await this.pokemonModel.insertMany(pokemonInserted);

    return { statusCode: 200, message: `created ${totInserted.length}` };
  }
}
