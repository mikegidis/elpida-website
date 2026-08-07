const pool = require("../../config/database");

async function createMessage({ name, email, phone, subject, message }) {
  const result = await pool.query(
    `
    INSERT INTO contact_messages (name, email, phone, subject, message)
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
    FROM contact_messages
    ORDER BY created_at DESC;
  `);

  return result.rows;
}

async function updateMessageStatus(id, status) {
  const result = await pool.query(
    `
    UPDATE contact_messages
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
  updateMessageStatus,
};
