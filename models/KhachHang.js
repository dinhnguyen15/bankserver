const mongoose = require('mongoose');

const khachHangSchema = new mongoose.Schema({
  MaKhachHang: { type: Number, required: true },
  CMT: { type: String, required: true },
  TenKhachHang: { type: String, required: true },
  NgaySinh: { type: Date, required: true },
  DiaChi: { type: String, required: true }
});

module.exports = mongoose.model('KhachHang', khachHangSchema);
