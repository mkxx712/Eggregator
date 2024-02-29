const { db } = require('@vercel/postgres');
const {
  holding,
  crypto,
} = require('../lib/placeholder-data.js');

async function seedHolding(client) {
  try {
    const dropTable = await client.sql`
    DROP TABLE IF EXISTS holding
  `;
    const createTable = await client.sql`
      CREATE TABLE holding (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        asset TEXT NOT NULL,
        belong TEXT NOT NULL,
        amount FLOAT(4) NOT NULL,
        buy_price FLOAT(4) NOT NULL,
        at TEXT NOT NULL
      );
    `;

    console.log(`Created "holding" table`);

    const insertedHolding = await Promise.all(
      holding.map(async (holding) => {
        return client.sql`
        INSERT INTO holding (asset, belong, amount, buy_price, at)
        VALUES (${holding.asset}, ${holding.belong}, ${holding.amount},${holding.buy_price},${holding.at});
      `;
      }),
    );

    console.log(`Seeded ${insertedHolding.length} assets`);

    return {
      dropTable,
      createTable,
      holding: insertedHolding,
    };
  } catch (error) {
    console.error('Error seeding holding:', error);
    throw error;
  }
}

async function seedCrypto(client) {
  try {
    const dropTable = await client.sql`
    DROP TABLE IF EXISTS crypto
  `;
    // Create the "holding" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE crypto (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset TEXT NOT NULL,
    price FLOAT(4) NOT NULL,
    y_price FLOAT(4) NOT NULL
  );
`;

    console.log(`Created "crypto" table`);

    // Insert data into the "crypto" table
    const insertedCrypto = await Promise.all(
      crypto.map(
        (crypto) => client.sql`
        INSERT INTO crypto (asset, price, y_price)
        VALUES (${crypto.asset}, ${crypto.price}, ${crypto.y_price});
      `,
      ),
    );

    console.log(`Seeded ${insertedCrypto.length} crypto`);

    return {
      dropTable,
      createTable,
      crypto: insertedCrypto,
    };
  } catch (error) {
    console.error('Error seeding crypto:', error);
    throw error;
  }
}


async function main() {
  const client = await db.connect();

  await seedHolding(client);
  await seedCrypto(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
