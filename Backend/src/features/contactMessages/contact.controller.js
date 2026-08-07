const contactModel = require("./contact.model");

async function submitMessage(req, res) {
  try {
    const { name, email, phone, businessType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const newMessage = await contactModel.createMessage({
      name,
      email,
      phone,
      subject: businessType || "General Inquiry",
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({ error: "Failed to submit message" });
  }
}

async function getAllMessages(req, res) {
  try {
    const messages = await contactModel.getMessages();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read", "archived"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedMessage = await contactModel.updateMessageStatus(id, status);

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ error: "Failed to update message status" });
  }
}

module.exports = {
  submitMessage,
  getAllMessages,
  updateStatus,
};
