const fs = require("fs");
const path = require("path");
const pool = require("../src/config/database");

async function runMigrations() {
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const migrationsDir = path.join(__dirname, "../migrations");

        const files = fs
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            const alreadyApplied = await client.query(
                "SELECT 1 FROM schema_migrations WHERE filename = $1",
                [file]
            );

            if (alreadyApplied.rowCount > 0) {
                console.log(`Skipping ${file} — already applied.`);
                continue;
            }

            const sql = fs.readFileSync(
                path.join(migrationsDir, file),
                "utf8"
            );

            console.log(`Applying ${file}...`);

            try {
                await client.query("BEGIN");
                await client.query(sql);
                await client.query(
                    "INSERT INTO schema_migrations (filename) VALUES ($1)",
                    [file]
                );
                await client.query("COMMIT");

                console.log(`Applied ${file}.`);
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            }
        }

        console.log("Database migrations complete.");
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});