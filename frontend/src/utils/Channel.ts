import assert from './assert';

const backendUrl = 'https://wax-ethlisbon-hackathon.deno.dev';

export default class Channel {
  constructor(public id: string) {}

  static async create(): Promise<Channel> {
    const response = await fetch(`${backendUrl}/channel`, {
      method: 'POST',
    })

    const id = await response.json()

    return new Channel(id);
  }

  async get(start?: number): Promise<unknown[]> {
    const url = new URL(`${backendUrl}/channel/${this.id}`);

    if (start !== undefined) {
      url.searchParams.set('start', start.toString());
    }

    const response = await fetch(url);

    return await response.json();
  }

  async push(data: unknown): Promise<number> {
    const response = await fetch(`${backendUrl}/channel/${this.id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const responseJson: unknown = await response.json();
    assert(typeof responseJson === 'number');

    return responseJson;
  }
}
