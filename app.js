const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const NhanVien = require('./models/NhanVien');
const KhachHang = require('./models/KhachHang');
const TaiKhoan = require('./models/TaiKhoan');
const ChiNhanh = require('./models/ChiNhanh');
const GiaoDich = require('./models/GiaoDich');
const KhachHang_TaiKhoan = require('./models/KhachHang_TaiKhoan');

const app = express();
const PORT = 3000;

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/banking', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Kết nối MongoDB thành công!'))
  .catch(err => console.error('Kết nối MongoDB thất bại!', err));
  
app.use(cors());
// Middleware
app.use(bodyParser.json());

// Endpoint cho NhanVien
app.post('/api/nhanvien', async (req, res) => {
  try {
    const nhanVien = new NhanVien(req.body);
    await nhanVien.save();
    res.status(201).send(nhanVien);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/nhanvien', async (req, res) => {
  const nhanVienData = await NhanVien.find();
  res.send(nhanVienData);
});

// Update employee by ID (PUT)
app.put('/api/nhanvien/:id', async (req, res) => {
    try {
        const nhanVien = await NhanVien.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!nhanVien) return res.status(404).send('Nhân viên không tìm thấy.');
        res.send(nhanVien);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/api/nhanvien/:id', async (req, res) => {
    try {
        const nhanVien = await NhanVien.findByIdAndDelete(req.params.id);
        if (!nhanVien) return res.status(404).send('Nhân viên không tìm thấy.');
        res.send({ message: 'Xóa nhân viên thành công!' });
    } catch (error) {
        res.status(500).send(error);
    }
});
 

// Endpoint cho KhachHang
app.post('/api/khachhang', async (req, res) => {
    try {
      const khachHang = new KhachHang(req.body);
      await khachHang.save();
      res.status(201).send(khachHang);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  

app.get('/api/khachhang', async (req, res) => {
  const khachHang = await KhachHang.find();
  res.send(khachHang);
});
// Cập nhật thông tin khách hàng theo ID
app.put('/api/khachhang/:id', async (req, res) => {
    try {
        const khachHang = await KhachHang.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!khachHang) return res.status(404).send('Khách hàng không tìm thấy.');
        res.send(khachHang);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Xóa khách hàng theo ID
app.delete('/api/khachhang/:id', async (req, res) => {
    try {
        const khachHang = await KhachHang.findByIdAndDelete(req.params.id);
        if (!khachHang) return res.status(404).send('Khách hàng không tìm thấy.');
        res.send({ message: 'Xóa khách hàng thành công!' });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Endpoint cho TaiKhoan
app.post('/api/taikhoan', async (req, res) => {
  try {
    const taiKhoan = new TaiKhoan(req.body);
    await taiKhoan.save();
    res.status(201).send(taiKhoan);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/taikhoan', async (req, res) => {
  const taiKhoan = await TaiKhoan.find();
  res.send(taiKhoan);
});
// Cập nhật tài khoản theo ID
app.put('/api/taikhoan/:id', async (req, res) => {
    try {
        const taiKhoan = await TaiKhoan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!taiKhoan) return res.status(404).send('Tài khoản không tìm thấy.');
        res.send(taiKhoan);
    } catch (error) {
        res.status(400).send(error);
    }
});
// Xóa tài khoản theo ID
app.delete('/api/taikhoan/:id', async (req, res) => {
    try {
        const taiKhoan = await TaiKhoan.findByIdAndDelete(req.params.id);
        if (!taiKhoan) return res.status(404).send('Tài khoản không tìm thấy.');
        res.send({ message: 'Xóa tài khoản thành công!' });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Endpoint cho ChiNhanh
app.post('/api/chinhanh', async (req, res) => {
  try {
    const chiNhanh = new ChiNhanh(req.body);
    await chiNhanh.save();
    res.status(201).send(chiNhanh);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/chinhanh', async (req, res) => {
  const chiNhanh = await ChiNhanh.find();
  res.send(chiNhanh);
});

// Endpoint cho GiaoDich
app.post('/api/giaodich', async (req, res) => {
  try {
    const giaoDich = new GiaoDich(req.body);
    await giaoDich.save();
    res.status(201).send(giaoDich);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/giaodich', async (req, res) => {
  const giaoDich = await GiaoDich.find();
  res.send(giaoDich);
});

// Endpoint cho KhachHang_TaiKhoan
app.post('/api/khachhang_taikhoan', async (req, res) => {
  try {
    const khachHangTaiKhoan = new KhachHang_TaiKhoan(req.body);
    await khachHangTaiKhoan.save();
    res.status(201).send(khachHangTaiKhoan);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/khachhang_taikhoan', async (req, res) => {
  const khachHangTaiKhoan = await KhachHang_TaiKhoan.find();
  res.send(khachHangTaiKhoan);
});

// Endpoint thực hiện giao dịch thanh toán từ tài khoản gửi tiền
app.post('/api/chuyen-khoan', async (req, res) => {
  const { taiKhoanNguon, taiKhoanDich, soTien, maNhanVien } = req.body;

  try {
    // Kiểm tra tài khoản nguồn
    const taiKhoanN = await TaiKhoan.findOne({ MaTaiKhoan: taiKhoanNguon });
    if (!taiKhoanN) return res.status(404).send('Tài khoản nguồn không tồn tại.');

    // Kiểm tra tài khoản đích
    const taiKhoanD = await TaiKhoan.findOne({ MaTaiKhoan: taiKhoanDich });
    if (!taiKhoanD) return res.status(404).send('Tài khoản đích không tồn tại.');

    // Kiểm tra số dư tài khoản nguồn
    if (taiKhoanN.SoDu < soTien) {
      return res.status(400).send('Số dư tài khoản nguồn không đủ.');
    }

    // Thực hiện giao dịch chuyển khoản
    taiKhoanN.SoDu -= soTien; // Giảm số dư tài khoản nguồn
    taiKhoanD.SoDu += soTien; // Tăng số dư tài khoản đích

    await taiKhoanN.save();
    await taiKhoanD.save();

    // Lưu thông tin giao dịch
    const giaoDich = new GiaoDich({
      MaGiaoDich: Math.floor(Math.random() * 100000), // Tạo mã giao dịch mới
      MaTaiKhoanNguon: taiKhoanNguon,
      LoaiGiaoDich: 'Chuyển khoản',
      SoTien: soTien,
      NgayGiaoDich: new Date(),
      MaNhanVien: maNhanVien, // Sử dụng mã nhân viên từ yêu cầu
      MaTaiKhoanDich: taiKhoanDich
    });

    await giaoDich.save();

    res.status(201).send({
      message: 'Giao dịch chuyển khoản thành công!',
      giaoDich,
      taiKhoanNguon: taiKhoanN,
      taiKhoanDich: taiKhoanD
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/nop-tien', async (req, res) => {
  const { taiKhoanDich, soTien, maNhanVien } = req.body;

  try {
    // Kiểm tra tài khoản đích
    const taiKhoanD = await TaiKhoan.findOne({ MaTaiKhoan: taiKhoanDich });
    if (!taiKhoanD) return res.status(404).send('Tài khoản đích không tồn tại.');

    // Thực hiện giao dịch nộp tiền
    taiKhoanD.SoDu += soTien; // Tăng số dư tài khoản đích

    await taiKhoanD.save();

    // Lưu thông tin giao dịch
    const giaoDich = new GiaoDich({
      MaGiaoDich: Math.floor(Math.random() * 100000), // Tạo mã giao dịch mới
      MaTaiKhoanNguon: null, // Để trống
      LoaiGiaoDich: 'Nộp tiền',
      SoTien: soTien,
      NgayGiaoDich: new Date(),
      MaNhanVien: maNhanVien, // Sử dụng mã nhân viên từ yêu cầu
      MaTaiKhoanDich: taiKhoanDich
    });

    await giaoDich.save();

    res.status(201).send({
      message: 'Giao dịch nộp tiền thành công!',
      giaoDich,
      taiKhoanDich: taiKhoanD
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/rut-tien', async (req, res) => {
  const { taiKhoanNguon, soTien, maNhanVien } = req.body;

  try {
    // Kiểm tra tài khoản nguồn
    const taiKhoanN = await TaiKhoan.findOne({ MaTaiKhoan: taiKhoanNguon });
    if (!taiKhoanN) return res.status(404).send('Tài khoản nguồn không tồn tại.');

    // Kiểm tra số dư tài khoản nguồn
    if (taiKhoanN.SoDu < soTien) {
      return res.status(400).send('Số dư tài khoản nguồn không đủ.');
    }

    // Thực hiện giao dịch rút tiền
    taiKhoanN.SoDu -= soTien; // Giảm số dư tài khoản nguồn

    await taiKhoanN.save();

    // Lưu thông tin giao dịch
    const giaoDich = new GiaoDich({
      MaGiaoDich: Math.floor(Math.random() * 100000), // Tạo mã giao dịch mới
      MaTaiKhoanNguon: taiKhoanNguon,
      LoaiGiaoDich: 'Rút tiền',
      SoTien: soTien,
      NgayGiaoDich: new Date(),
      MaNhanVien: maNhanVien, // Sử dụng mã nhân viên từ yêu cầu
      MaTaiKhoanDich: null // Để trống
    });

    await giaoDich.save();

    res.status(201).send({
      message: 'Giao dịch rút tiền thành công!',
      giaoDich,
      taiKhoanNguon: taiKhoanN
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
