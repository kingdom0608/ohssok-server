import axios from 'axios';
import { HttpException } from '@nestjs/common';

export class InternalApiService {
  private readonly baseUrl: string;
  constructor() {
    this.baseUrl = `http://localhost:3000`;
  }

  async get(url: string, query?: any) {
    const { data } = await axios.get(`${this.baseUrl}/${url}`, {
      params: query,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
    return data;
  }

  async put(url: string, body?: any) {
    try {
      const { data } = await axios.put(
        `${this.baseUrl}/${url}`,
        {
          ...body,
        },
        {
          timeout: 1000,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      );
      return data;
    } catch (err) {
      throw new HttpException(err, err.response.data.code);
    }
  }

  async post(url: string, body?: any) {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}/${url}`,
        {
          ...body,
        },
        {
          timeout: 1000,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      );
      return data;
    } catch (err) {
      throw new HttpException(err, err.response.data.code);
    }
  }
}
