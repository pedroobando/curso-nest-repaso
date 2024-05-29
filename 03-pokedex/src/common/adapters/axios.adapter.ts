import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  // NOTE: hay que definirlo en el common.module.ts
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await axios.get<T>(url);
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(`This is a error - Check logs`);
    }
  }
}
