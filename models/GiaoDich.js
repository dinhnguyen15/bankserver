const mongoose = require('mongoose');

const giaoDichSchema = new mongoose.Schema({
  MaGiaoDich: { type: Number, required: true },
  MaTaiKhoanNguon: { type: Number, required: false }, 
  LoaiGiaoDich: { type: String, required: true },
  SoTien: { type: Number, required: true },
  NgayGiaoDich: { type: Date, required: true },
  MaNhanVien: { type: Number, required: true },
  MaTaiKhoanDich: { type: Number, required: function() { return this.LoaiGiaoDich === 'Chuyển khoản'; } }
});

module.exports = mongoose.model('GiaoDich', giaoDichSchema);
