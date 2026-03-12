var express = require('express');
var router = express.Router();
const User = require('../models/user'); // Đảm bảo đường dẫn đúng

// GET ALL (Chưa xóa)
router.get('/', async (req, res) => {
    let users = await User.find({ isDeleted: false });
    res.json(users);
});

// routes/users.js
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        // Trả về JSON lỗi thay vì render view error
        res.status(400).json({ message: err.message });
    }
});

// POST /enable (Yêu cầu 2)
router.post('/enable', async (req, res) => {
    const { email, username } = req.body;
    let user = await User.findOne({ email, username });
    if (user) {
        user.status = true;
        await user.save();
        res.json({ message: "Đã kích hoạt thành công", user });
    } else {
        res.status(404).json({ message: "Không tìm thấy user" });
    }
});

// Thêm vào routes/users.js
router.post('/disable', async (req, res) => {
    try {
        const { email, username } = req.body;
        // Tìm user theo email và username
        let user = await User.findOne({ email, username });
        
        if (user) {
            user.status = false; // Chuyển status về false
            await user.save();
            res.json({ message: "Đã vô hiệu hóa tài khoản thành công", user });
        } else {
            res.status(404).json({ message: "Không tìm thấy user với thông tin đã cung cấp" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET BY ID
router.get('/:id', async (req, res) => {
    let user = await User.findById(req.params.id);
    res.json(user);
});

// Thêm vào routes/users.js
router.get('/roles/:id/users', async (req, res) => {
    try {
        const roleId = req.params.id;
        // Tìm tất cả user có role khớp với roleId và chưa bị xóa mềm
        const users = await User.find({ role: roleId, isDeleted: false });
        
        if (users.length === 0) {
            return res.json({ message: "Không tìm thấy user nào với role này", data: [] });
        }
        
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// DELETE (Xóa mềm)
router.delete('/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Đã xóa mềm" });
});

module.exports = router;