var express = require('express');
var router = express.Router();
const Role = require('../schemas/roles'); // Import schema/model đã tạo

// C: Tạo Role mới
router.post('/', async (req, res) => {
    try {
        const newRole = new Role(req.body);
        await newRole.save();
        res.status(201).json(newRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// R: Lấy tất cả Role (không lấy bản ghi đã xóa mềm nếu có)
router.get('/', async (req, res) => {
    const roles = await Role.find({ isDeleted: { $ne: true } });
    res.json(roles);
});

// R: Lấy Role theo ID
router.get('/:id', async (req, res) => {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    res.json(role);
});

// U: Cập nhật Role
router.put('/:id', async (req, res) => {
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRole);
});

// D: Xóa mềm
router.delete('/:id', async (req, res) => {
    await Role.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Role đã được xóa mềm" });
});

module.exports = router;