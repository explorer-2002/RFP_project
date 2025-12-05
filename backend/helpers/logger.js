import { Logtail } from '@logtail/node';
import dotenv from 'dotenv';

dotenv.config();

export const logtail = new Logtail(process.env.BETTERSTACK_SOURCE_TOKEN, {
  endpoint: `https://${process.env.BETTERSTACK_INGESTING_HOST}`,
});
