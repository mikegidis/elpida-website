const messageModel = require("./message.model");

async function submitMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const newMessage = await messageModel.createMessage({
      name,
      email,
      phone,
      subject: subject || req.body.businessType || "General Inquiry",
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
    const messages = await messageModel.getMessages();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

async function getMessage(req, res) {
  try {
    const { id } = req.params;
    const message = await messageModel.getMessageById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ error: "Failed to fetch message" });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Unread", "Read", "Archived"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be Unread, Read, or Archived" });
    }

    const updatedMessage = await messageModel.updateMessageStatus(id, status);

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
  getMessage,
  updateStatus,
};
