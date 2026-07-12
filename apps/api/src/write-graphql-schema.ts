import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { printSchema } from 'graphql';

import { AppModule } from './app.module';

async function writeGraphqlSchema() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });

  try {
    const gqlSchemaHost = app.get(GraphQLSchemaHost);
    const sdl = printSchema(gqlSchemaHost.schema);
    const outPath = path.join(process.cwd(), 'src/_generated/schema.graphql');

    mkdirSync(path.dirname(outPath), { recursive: true });
    writeFileSync(outPath, sdl);
  } finally {
    await app.close();
  }
}

writeGraphqlSchema().catch((e) => {
  console.error(e);
  process.exit(1);
});
