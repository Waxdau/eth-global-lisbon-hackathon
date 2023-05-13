import {Buffer} from 'buffer';

const globalRecord = globalThis as Record<string, unknown>;

globalRecord.Buffer = Buffer;
