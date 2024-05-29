import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces';

@Injectable()
export class FetchAdapter implements HttpAdapter {
  // private faxios: AxiosInstance = axios;

  // const listpokemon = await fetch('https://pokeapi.co/api/v2/pokemon?limit=650');
  // const { results } = await listpokemon.json();

  // NOTE: hay que definirlo en el common.module.ts
  async get<T>(url: string): Promise<T> {
    try {
      const data = await fetch(url);
      const results = await data.json();
      return results as T;
    } catch (error) {
      console.log(error);
      throw new Error(`This is a error - Check logs`);
    }
  }
}
