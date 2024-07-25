import { PrismaClient } from '@prisma/client';
import { withPulse } from '@prisma/extension-pulse';

const prismaClientSingleton = () => {
  // return new PrismaClient() //.$extends(withPulse({ apiKey: process.env.PULSE_API_KEY }));
  return new PrismaClient().$extends(
    withPulse({ apiKey: process.env.PULSE_API_KEY || '' })
  );
};

declare const globalThis: {
  prismaGlobalWithPulse: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaWithPulse =
  globalThis.prismaGlobalWithPulse ?? prismaClientSingleton();

export default prismaWithPulse;

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaGlobalWithPulse = prismaWithPulse;
