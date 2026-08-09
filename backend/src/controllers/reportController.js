const Report = require("../models/Report");

// @route  POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ message: "targetType, targetId, and reason are required" });
    }

    const report = await Report.create({
      reportedBy: req.user.userId,
      targetType,
      targetId,
      reason,
    });

    res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;