const mongoose = require('mongoose');

const chiNhanhSchema = new mongoose.Schema({
  MaChiNhanh: { type: Number, required: true },
  TenChiNhanh: { type: String, required: true },
  DiaChi: { type: String, required: true },
  SoDienThoai: { type: String, required: true }
});

module.exports = mongoose.model('ChiNhanh', chiNhanhSchema);
