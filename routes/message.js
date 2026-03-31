const express = require("express");
const router = express.Router();
const Message = require("../schemas/message");
const auth = require("../utils/auth");


// ✅ 1. GET message theo userID
router.get("/:userID", auth, async (req, res) => {
    try {
        const currentUser = req.user.id;
        const otherUser = req.params.userID;

        const messages = await Message.find({
            $or: [
                { from: currentUser, to: otherUser },
                { from: otherUser, to: currentUser }
            ]
        }).sort({ createdAt: 1 });

        res.json({
            success: true,
            data: messages
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ✅ 2. POST gửi message
router.post("/", auth, async (req, res) => {
    try {
        const { to, text, file } = req.body;

        // validate
        if (!to) {
            return res.status(400).json({
                success: false,
                message: "Missing 'to' user"
            });
        }

        let type = "text";
        let content = text;

        if (file) {
            type = "file";
            content = file;
        }

        const message = new Message({
            from: req.user.id,
            to: to,
            messageContent: {
                type: type,
                text: content
            }
        });

        await message.save();

        res.json({
            success: true,
            data: message
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ✅ 3. GET last message mỗi user
router.get("/", auth, async (req, res) => {
    try {
        const currentUser = req.user.id;

        const result = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { from: currentUser },
                        { to: currentUser }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        user: {
                            $cond: [
                                { $eq: ["$from", currentUser] },
                                "$to",
                                "$from"
                            ]
                        }
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// 🔥 QUAN TRỌNG NHẤT (thiếu cái này là crash)
module.exports = router;