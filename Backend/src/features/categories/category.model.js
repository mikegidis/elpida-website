const pool = require("../../config/database");

async function getAllCategories() {
  const result = await pool.query(`
    SELECT
      id,
      name,
      description
    FROM categories
    ORDER BY name;
  `);

  return result.rows;
}

async function createCategory({ name, description }) {
  const result = await pool.query(`
    INSERT INTO categories (name, description)
    VALUES ($1, $2)
    RETURNING id, name, description;
  `, [name, description]);

  return result.rows[0];
}

async function updateCategory(id, { name, description }) {
  const result = await pool.query(`
    UPDATE categories
    SET name = $1,
        description = $2
    WHERE id = $3
    RETURNING id, name, description;
  `, [name, description, id]);

  return result.rows[0] || null;
}

async function deleteCategory(id) {
  const result = await pool.query(`
    DELETE FROM categories
    WHERE id = $1
    RETURNING id;
  `, [id]);

  return result.rowCount > 0;
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
