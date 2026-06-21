import path from 'path';
import fs from "node:fs";
import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const sslEnabled = env.bool("DATABASE_SSL", true);

  return {
    connection: {
      client: "postgres",
      connection: {
        host: env("DATABASE_HOST"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "postgres"),
        user: env("DATABASE_USERNAME"),
        password: env("DATABASE_PASSWORD"),
        schema: env("DATABASE_SCHEMA", "strapi"),
        ssl: sslEnabled
          ? {
              ca: fs.readFileSync(
                path.resolve(
                  process.cwd(),
                  env(
                    "DATABASE_SSL_CA_PATH",
                    "certs/supabase-ca.crt",
                  ),
                ),
                "utf8",
              ),
              rejectUnauthorized: true,
            }
          : false,
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 0),
        max: env.int("DATABASE_POOL_MAX", 5),
      },
      acquireConnectionTimeout: env.int(
        "DATABASE_CONNECTION_TIMEOUT",
        60000,
      ),
    },
  };
};

export default config;
