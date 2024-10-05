const mongoose = require('mongoose');

const khachHangTaiKhoanSchema = new mongoose.Schema({
  MaKhachHang: { type: Number, required: true },
  MaTaiKhoan: { type: Number, required: true }
});

module.exports = mongoose.model('KhachHang_TaiKhoan', khachHangTaiKhoanSchema);
