const mongoose = require('mongoose');

const taiKhoanSchema = new mongoose.Schema({
  MaTaiKhoan: { type: Number, required: true },
  MaKhachHang: { type: Number, required: true },
  LoaiTaiKhoan: { type: String, required: true },
  SoDu: { type: Number, required: true },
  LaiSuat: { type: Number },
  HanMucTinDung: { type: Number },
  SoDuToiThieu: { type: Number }
});

module.exports = mongoose.model('TaiKhoan', taiKhoanSchema);
