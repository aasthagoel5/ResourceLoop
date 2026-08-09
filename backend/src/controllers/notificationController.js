const Notification = require("../models/Notification");

// @route  GET /api/notifications
// @desc   Get the logged-in user's notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.readStatus).length;

    res.status(200).json({ count: notifications.length, unreadCount, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/notifications/:id/read
// @desc   Mark a single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to modify this notification" });
    }

    notification.readStatus = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/notifications/read-all
// @desc   Mark all of the logged-in user's notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, readStatus: false },
      { $set: { readStatus: true } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};