const pool = require("../../config/database");

async function createMessage({ name, email, phone, subject, message }) {
  const result = await pool.query(
    `
    INSERT INTO messages (name, email, phone, subject, message)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, subject, message, status, created_at;
  `,
    [name, email, phone, subject, message]
  );

  return result.rows[0];
}

async function getMessages() {
  const result = await pool.query(`
    SELECT
      id,
      name,
      email,
      phone,
      subject,
      message,
      status,
      created_at
    FROM messages
    ORDER BY created_at DESC;
  `);

  return result.rows;
}

async function getMessageById(id) {
  const result = await pool.query(`
    SELECT
      id,
      name,
      email,
      phone,
      subject,
      message,
      status,
      created_at
    FROM messages
    WHERE id = $1;
  `, [id]);

  return result.rows[0] || null;
}

async function updateMessageStatus(id, status) {
  const result = await pool.query(
    `
    UPDATE messages
    SET status = $1
    WHERE id = $2
    RETURNING id, name, email, phone, subject, message, status, created_at;
  `,
    [status, id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
};
