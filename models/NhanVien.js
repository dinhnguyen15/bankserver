const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
  MaNhanVien: { type: Number, required: true },
  CMT: { type: String, required: true },
  TenNhanVien: { type: String, required: true },
  NgaySinh: { type: Date, required: true },
  DiaChi: { type: String, required: true },
  BacNghe: { type: String, required: true },
  ThamNien: { type: Number, required: true },
  ViTri: { type: String, required: true }
});

module.exports = mongoose.model('NhanVien', nhanVienSchema);
