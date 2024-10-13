const baseURL = 'http://localhost:3000/';
let editingRow = null; // Biến để theo dõi dòng đang sửa
// Hàm để chuyển tab
function showTab(tabName) {
    // Ẩn tất cả các tab
    document.getElementById('nhanVienTab').style.display = 'none';
    document.getElementById('khachHangTab').style.display = 'none';
    document.getElementById('giaoDichTab').style.display = 'none';
    document.getElementById('taiKhoanTab').style.display = 'none';
    
    // Hiện tab được chọn
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // Cập nhật các liên kết trong sidebar
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
        link.classList.remove('active'); // Xóa lớp active khỏi tất cả các liên kết
    });
    
    // Thêm lớp active vào liên kết được chọn
    const selectedLink = document.querySelector(`.sidebar a[onclick="showTab('${tabName}')"]`);
    if (selectedLink) {
        selectedLink.classList.add('active');
    }
}

// Mặc định hiện tab quản lý nhân viên khi tải trang
document.addEventListener("DOMContentLoaded", function() {
    showTab('nhanVien');
    layDanhSachNhanVien(); // Gọi hàm để lấy danh sách nhân viên khi vào tab này
});


async function themNhanVien() {
    const nhanVien = {
        MaNhanVien: document.getElementById('MaNhanVien').value,
        CMT: document.getElementById('CMT').value,
        TenNhanVien: document.getElementById('TenNhanVien').value,
        NgaySinh: document.getElementById('NgaySinh').value,
        DiaChi: document.getElementById('DiaChi').value,
        BacNghe: document.getElementById('BacNghe').value,
        ThamNien: document.getElementById('ThamNien').value,
        ViTri: document.getElementById('ViTri').value,
    };

    try {
        const response = await fetch(`${baseURL}api/nhanvien`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nhanVien)
        });
        const data = await response.json();
        if (response.ok) {
            alert('Thêm nhân viên thành công!');
            layDanhSachNhanVien(); // Cập nhật lại danh sách nhân viên sau khi thêm
            
            // Đặt lại giá trị các trường
            resetForm();
        } else {
            alert('Vui lòng nhập đủ thông tin!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

async function layDanhSachNhanVien() {
    try {
        const response = await fetch(`${baseURL}api/nhanvien`);
        const data = await response.json();
        if (response.ok) {
            let output = `
                <h3>Danh Sách Nhân Viên</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Mã Nhân Viên</th>
                            <th>Chứng minh thư</th>
                            <th>Tên Nhân Viên</th>
                            <th>Ngày Sinh</th>
                            <th>Địa Chỉ</th>
                            <th>Bậc Nghề</th>
                            <th>Thâm Niên</th>
                            <th>Vị Trí Công Việc</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            data.forEach(nhanVien => {
                output += `
                    <tr id="row-${nhanVien._id}">
                        <td>${nhanVien.MaNhanVien}</td>
                        <td>${nhanVien.CMT}</td>
                        <td>${nhanVien.TenNhanVien}</td>
                        <td>${new Date(nhanVien.NgaySinh).toLocaleDateString()}</td>
                        <td>${nhanVien.DiaChi}</td>
                        <td>${nhanVien.BacNghe}</td>
                        <td>${nhanVien.ThamNien}</td>
                        <td>${nhanVien.ViTri}</td>
                        <td>
                            <button class="btn-sua" onclick="editNhanVien('${nhanVien._id}', this)">Sửa</button>
                            <button class="btn-xoa" onclick="xoaNhanVien('${nhanVien._id}', this)">Xóa</button>
                        </td>
                    </tr>
                `;
            });
            output += `
                    </tbody>
                </table>
            `;
            document.getElementById('danhSachNhanVien').innerHTML = output;
        } else {
            alert('Không thể lấy danh sách nhân viên!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

async function editNhanVien(id, btn) {
    const row = btn.closest('tr');
    if (editingRow && editingRow !== row) {
        alert('Vui lòng lưu hoặc hủy dòng đang chỉnh sửa trước khi chỉnh sửa dòng khác.');
        return;
    }

    editingRow = row;
    row.classList.add('editing');

    const cells = row.children;
    const oldValues = [];
    for (let i = 0; i < cells.length - 1; i++) {
        oldValues.push(cells[i].innerText);
        if (i === 5) {
            cells[i].innerHTML = `
                <select>
                    <option value="Nhân viên" ${oldValues[i] === 'Nhân viên' ? 'selected' : ''}>Nhân viên</option>
                    <option value="Chuyên viên" ${oldValues[i] === 'Chuyên viên' ? 'selected' : ''}>Chuyên viên</option>
                    <option value="Thực tập sinh" ${oldValues[i] === 'Thực tập sinh' ? 'selected' : ''}>Thực tập sinh</option>
                    <option value="Trưởng nhóm" ${oldValues[i] === 'Trưởng nhóm' ? 'selected' : ''}>Trưởng nhóm</option>
                    <option value="Quản lý" ${oldValues[i] === 'Quản lý' ? 'selected' : ''}>Quản lý</option>
                </select>
            `;
        } else if (i === 7) {
            cells[i].innerHTML = `
                <select>
                    <option value="Kinh doanh" ${oldValues[i] === 'Kinh doanh' ? 'selected' : ''}>Kinh doanh</option>
                    <option value="Dịch vụ" ${oldValues[i] === 'Dịch vụ' ? 'selected' : ''}>Dịch vụ</option>
                    <option value="Tài chính-Kế toán" ${oldValues[i] === 'Tài chính-Kế toán' ? 'selected' : ''}>Tài chính-Kế toán</option>
                    <option value="IT" ${oldValues[i] === 'IT' ? 'selected' : ''}>IT</option>
                    <option value="Marketing" ${oldValues[i] === 'Marketing' ? 'selected' : ''}>Marketing</option>
                </select>
            `;
        } else {
            cells[i].innerHTML = `<input type="text" value="${oldValues[i]}">`;
        }
    }

    btn.innerText = 'Lưu';
    btn.setAttribute('onclick', `luuNhanVien('${id}', this)`);
}


async function luuNhanVien(id, btn) {
    const inputs = editingRow.getElementsByTagName('input');
    const selects = editingRow.getElementsByTagName('select');
    const nhanVien = {
        MaNhanVien: inputs[0].value,
        CMT: inputs[1].value,
        TenNhanVien: inputs[2].value,
        NgaySinh: inputs[3].value,
        DiaChi: inputs[4].value,
        BacNghe: selects[0].value, // Giá trị từ ô select cho Bậc Nghề
        ThamNien: inputs[5].value,
        ViTri: selects[1].value, // Giá trị từ ô select cho Vị Trí Công Việc
    };

    try {
        const response = await fetch(`${baseURL}api/nhanvien/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nhanVien)
        });
        if (response.ok) {
            alert('Cập nhật nhân viên thành công!');
            layDanhSachNhanVien(); // Cập nhật lại danh sách nhân viên sau khi cập nhật
            
            // Đặt lại giá trị các ô trong bảng
            editingRow.children[0].innerHTML = nhanVien.MaNhanVien;
            editingRow.children[1].innerHTML = nhanVien.CMT;
            editingRow.children[2].innerHTML = nhanVien.TenNhanVien;
            editingRow.children[3].innerHTML = new Date(nhanVien.NgaySinh).toLocaleDateString();
            editingRow.children[4].innerHTML = nhanVien.DiaChi;
            editingRow.children[5].innerHTML = nhanVien.BacNghe;
            editingRow.children[6].innerHTML = nhanVien.ThamNien;
            editingRow.children[7].innerHTML = nhanVien.ViTri;

            editingRow.classList.remove('editing');
            editingRow = null;
            btn.innerText = 'Sửa';
            btn.setAttribute('onclick', `editNhanVien('${id}', this)`);
        } else {
            alert('Vui lòng nhập đủ thông tin!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}


async function xoaNhanVien(id, btn) {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa nhân viên này không?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${baseURL}api/nhanvien/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Xóa nhân viên thành công!');
            layDanhSachNhanVien(); // Cập nhật lại danh sách nhân viên sau khi xóa
        } else {
            alert('Không thể xóa nhân viên!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

function resetForm() {
    document.getElementById('MaNhanVien').value = '';
    document.getElementById('CMT').value = '';
    document.getElementById('TenNhanVien').value = '';
    document.getElementById('NgaySinh').value = '';
    document.getElementById('DiaChi').value = '';
    document.getElementById('BacNghe').value = '';
    document.getElementById('ThamNien').value = '';
    document.getElementById('ViTri').value = '';
}

document.addEventListener("DOMContentLoaded", layDanhSachNhanVien);

async function themKhachHang() {
    const khachHang = {
        MaKhachHang: document.getElementById('MaKhachHang').value,
        CMT: document.getElementById('CMT2').value,
        TenKhachHang: document.getElementById('TenKhachHang').value,
        NgaySinh: document.getElementById('NgaySinh2').value,
        DiaChi: document.getElementById('DiaChi2').value,
    };

    try {
        const response = await fetch(`${baseURL}api/khachhang`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(khachHang)
        });
        const data = await response.json();
        if (response.ok) {
            alert('Thêm khách hàng thành công!');
            layDanhSachKhachHang(); // Cập nhật lại danh sách khách hàng sau khi thêm
            
            // Đặt lại giá trị các trường
            resetFormKhachHang();
        } else {
            alert('Vui lòng nhập đủ thông tin!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

async function layDanhSachKhachHang() {
    try {
        const response = await fetch(`${baseURL}api/khachhang`);
        const data = await response.json();
        if (response.ok) {
            let output = `
                <h3>Danh Sách Khách Hàng</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Mã Khách Hàng</th>
                            <th>Chứng Minh Thư</th>
                            <th>Tên Khách Hàng</th>
                            <th>Ngày Sinh</th>
                            <th>Địa Chỉ</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            data.forEach(khachHang => {
                output += `
                    <tr id="row-${khachHang._id}">
                        <td>${khachHang.MaKhachHang}</td>
                        <td>${khachHang.CMT}</td>
                        <td>${khachHang.TenKhachHang}</td>
                        <td>${new Date(khachHang.NgaySinh).toLocaleDateString()}</td>
                        <td>${khachHang.DiaChi}</td>
                        <td>
                            <button class="btn-sua" onclick="editKhachHang('${khachHang._id}', this)">Sửa</button>
                            <button class="btn-xoa" onclick="xoaKhachHang('${khachHang._id}', this)">Xóa</button>
                        </td>
                    </tr>
                `;
            });
            output += `
                    </tbody>
                </table>
            `;
            document.getElementById('danhSachKhachHang').innerHTML = output;
        } else {
            alert('Không thể lấy danh sách khách hàng!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

async function editKhachHang(id, btn) {
    const row = btn.closest('tr');
    if (editingRow && editingRow !== row) { // Nếu đã có dòng đang chỉnh sửa, hủy chỉnh sửa
        alert('Vui lòng lưu hoặc hủy dòng đang chỉnh sửa trước khi chỉnh sửa dòng khác.');
        return;
    }

    // Đánh dấu dòng đang chỉnh sửa
    editingRow = row;
    row.classList.add('editing'); // Thêm lớp để làm nổi bật dòng

    // Lấy dữ liệu từ dòng và thay thế bằng các input fields
    const cells = row.children;
    const oldValues = [];
    for (let i = 0; i < cells.length - 1; i++) { // Không thay thế ô cuối cùng (nút hành động)
        oldValues.push(cells[i].innerText); // Lưu lại giá trị cũ
        cells[i].innerHTML = `<input type="text" value="${oldValues[i]}">`; // Thay thế bằng input
    }

    // Thay đổi nút sửa thành lưu
    btn.innerText = 'Lưu';
    btn.setAttribute('onclick', `luuKhachHang('${id}', this)`); // Thay đổi hành động cho nút
}

async function luuKhachHang(id, btn) {
    const inputs = editingRow.getElementsByTagName('input');
    const khachHang = {
        MaKhachHang: inputs[0].value,
        CMT: inputs[1].value,
        TenKhachHang: inputs[2].value,
        NgaySinh: inputs[3].value,
        DiaChi: inputs[4].value,
    };

    try {
        const response = await fetch(`${baseURL}api/khachhang/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(khachHang)
        });
        const data = await response.json();
        if (response.ok) {
            alert('Cập nhật khách hàng thành công!');
            layDanhSachKhachHang(); // Cập nhật lại danh sách khách hàng sau khi cập nhật
            
            // Đặt lại giá trị các ô trong bảng
            for (let i = 0; i < editingRow.children.length - 1; i++) {
                editingRow.children[i].innerHTML = khachHang[Object.keys(khachHang)[i]];
            }
            
            editingRow.classList.remove('editing'); // Bỏ đánh dấu dòng đang chỉnh sửa
            editingRow = null; // Reset lại biến
            btn.innerText = 'Sửa'; // Đổi lại nút về "Sửa"
            btn.setAttribute('onclick', `editKhachHang('${id}', this)`); // Reset hành động cho nút
        } else {
            alert('Vui lòng nhập đủ thông tin!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

async function xoaKhachHang(id, btn) {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa khách hàng này không?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${baseURL}api/khachhang/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Xóa khách hàng thành công!');
            layDanhSachKhachHang(); // Cập nhật lại danh sách khách hàng sau khi xóa
        } else {
            alert('Không thể xóa khách hàng!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

function resetFormKhachHang() {
    document.getElementById('MaKhachHang').value = '';
    document.getElementById('CMT2').value = '';
    document.getElementById('TenKhachHang').value = '';
    document.getElementById('NgaySinh2').value = '';
    document.getElementById('DiaChi2').value = '';
}

document.addEventListener("DOMContentLoaded", layDanhSachKhachHang);

function hienThiThongTinLoaiTaiKhoan() {
    const loaiTaiKhoan = document.getElementById('LoaiTaiKhoan').value;

    // Lấy các phần tử cần điều chỉnh hiển thị
    const laiSuatDiv = document.getElementById('laiSuatDiv');
    const hanMucTinDungDiv = document.getElementById('hanMucTinDungDiv');
    const soDuToiThieuDiv = document.getElementById('soDuToiThieuDiv');

    // Ẩn tất cả các trường liên quan
    laiSuatDiv.style.display = 'none';
    hanMucTinDungDiv.style.display = 'none';
    soDuToiThieuDiv.style.display = 'none';

    // Hiện các trường tùy thuộc vào loại tài khoản
    if (loaiTaiKhoan === 'Tín dụng') {
        hanMucTinDungDiv.style.display = 'block';
    } else if (loaiTaiKhoan === 'Gửi tiền') {
        laiSuatDiv.style.display = 'block';
        soDuToiThieuDiv.style.display = 'block';
    }
}

async function layDanhSachTaiKhoan() {
    try {
        // Lấy danh sách tài khoản
        const responseTaiKhoan = await fetch(`${baseURL}api/taikhoan`);
        const dataTaiKhoan = await responseTaiKhoan.json();

        // Lấy danh sách khách hàng để ánh xạ mã khách hàng với tên
        const responseKhachHang = await fetch(`${baseURL}api/khachhang`);
        const dataKhachHang = await responseKhachHang.json();

        if (responseTaiKhoan.ok && responseKhachHang.ok) {
            // Tạo một ánh xạ giữa MaKhachHang và TenKhachHang
            const khachHangMap = {};
            dataKhachHang.forEach(khachHang => {
                khachHangMap[khachHang.MaKhachHang] = khachHang.TenKhachHang;
            });

            let output = `
                <h3>Danh Sách Tài Khoản</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Mã Tài Khoản</th>
                            <th>Tên Khách Hàng</th>
                            <th>Loại Tài Khoản</th>
                            <th>Số Dư</th>
                            <th>Lãi Suất</th>
                            <th>Hạn Mức Tín Dụng</th>
                            <th>Số Dư Tối Thiểu</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            dataTaiKhoan.forEach(taiKhoan => {
                output += `
                    <tr id="row-${taiKhoan._id}">
                        <td>${taiKhoan.MaTaiKhoan}</td>
                        <td>${khachHangMap[taiKhoan.MaKhachHang] || 'N/A'}</td>
                        <td>${taiKhoan.LoaiTaiKhoan}</td>
                        <td>${taiKhoan.SoDu.toFixed(2)}</td>
                        <td>${taiKhoan.LaiSuat ? taiKhoan.LaiSuat.toFixed(2) : ''}</td>
                        <td>${taiKhoan.HanMucTinDung ? taiKhoan.HanMucTinDung.toFixed(2) : ''}</td>
                        <td>${taiKhoan.SoDuToiThieu ? taiKhoan.SoDuToiThieu.toFixed(2) : ''}</td>
                        <td>
                            <button class="btn-sua" onclick="editTaiKhoan('${taiKhoan._id}', this)">Sửa</button>
                            <button class="btn-xoa" onclick="xoaTaiKhoan('${taiKhoan._id}', this)">Xóa</button>
                        </td>
                    </tr>
                `;
            });

            output += `
                    </tbody>
                </table>
            `;
            document.getElementById('danhSachTaiKhoan').innerHTML = output;
        } else {
            alert('Không thể lấy danh sách tài khoản hoặc khách hàng!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}


// Hàm lấy danh sách khách hàng và thêm vào dropdown
async function loadKhachHangOptions() {
    try {
        const response = await fetch(`${baseURL}api/khachhang`);
        if (!response.ok) {
            alert('Không thể lấy danh sách khách hàng!');
            return;
        }
        const data = await response.json();
        console.log('Danh sách khách hàng:', data);

        const khachHangSelect = document.getElementById('MaKhachHang2');
        console.log('Phần tử select:', khachHangSelect);

        if (khachHangSelect) {
            // Xóa các tùy chọn cũ trước khi thêm mới
            khachHangSelect.innerHTML = '<option value="" disabled selected>Chọn khách hàng</option>';

            data.forEach(khachHang => {
                const option = document.createElement('option');
                option.value = khachHang.MaKhachHang;
                option.text = khachHang.TenKhachHang;
                khachHangSelect.appendChild(option);
            });
        } else {
            console.error('Không tìm thấy phần tử select với id MaKhachHang');
        }
    } catch (error) {
        console.error('Lỗi kết nối tới server!', error);
        alert('Lỗi kết nối tới server!');
    }
}


// Gọi hàm load danh sách khách hàng khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    layDanhSachTaiKhoan();
    loadKhachHangOptions();
});

// Hàm lấy toàn bộ danh sách tài khoản và kiểm tra mã tài khoản
async function layDanhSachVaKiemTraMaTaiKhoan(maTaiKhoan) {
    try {
        const response = await fetch(`${baseURL}api/taikhoan`);
        const data = await response.json();

        // Duyệt qua danh sách tài khoản để kiểm tra mã tài khoản
        const taiKhoanTonTai = data.some(taiKhoan => taiKhoan.MaTaiKhoan === maTaiKhoan);
        return taiKhoanTonTai; // Trả về true nếu mã tài khoản tồn tại, false nếu không
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài khoản!', error);
        return false;
    }
}

// Hàm thêm tài khoản
async function themTaiKhoan() {
    const maTaiKhoan = document.getElementById('MaTaiKhoan').value;

    // Kiểm tra xem mã tài khoản có trùng hay không
    const maTaiKhoanTonTai = await layDanhSachVaKiemTraMaTaiKhoan(maTaiKhoan);
    if (maTaiKhoanTonTai) {
        alert('Mã tài khoản đã tồn tại! Vui lòng nhập mã khác.');
        return;
    }

    // Nếu mã tài khoản chưa tồn tại, tiếp tục thêm tài khoản
    const taiKhoan = {
        MaTaiKhoan: maTaiKhoan,
        MaKhachHang: document.getElementById('MaKhachHang2').value,
        LoaiTaiKhoan: document.getElementById('LoaiTaiKhoan').value,
        SoDu: document.getElementById('SoDu').value,
        LaiSuat: document.getElementById('LaiSuat').value,
        HanMucTinDung: document.getElementById('HanMucTinDung').value,
        SoDuToiThieu: document.getElementById('SoDuToiThieu').value
    };

    try {
        const response = await fetch(`${baseURL}api/taikhoan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taiKhoan)
        });

        if (response.ok) {
            alert('Thêm tài khoản thành công!');
            layDanhSachTaiKhoan();
            resetFormTaiKhoan();
        } else {
            const error = await response.json();
            alert(`Lỗi: ${error.message}`);
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}



// Hàm load danh sách khách hàng vào dropdown trong phần chỉnh sửa
async function loadKhachHangOptionsForEdit(selectId, selectedMaKhachHang) {
    try {
        const response = await fetch(`${baseURL}api/khachhang`);
        if (!response.ok) {
            alert('Không thể lấy danh sách khách hàng!');
            return;
        }
        const data = await response.json();
        const selectElement = document.getElementById(selectId);

        data.forEach(khachHang => {
            const option = document.createElement('option');
            option.value = khachHang.MaKhachHang;
            option.text = khachHang.TenKhachHang;
            if (khachHang.MaKhachHang === selectedMaKhachHang) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}


// Hàm lưu tài khoản sau khi chỉnh sửa
async function luuTaiKhoan(id, btn) {
    const inputs = editingRow.getElementsByTagName('input');

    // Xác định từng giá trị của các input theo chỉ số đúng
    const soDu = parseFloat(inputs[3].value) || 0; // Giá trị của số dư
    const laiSuat = parseFloat(inputs[4].value) || 0; // Lãi suất
    const hanMucTinDung = (inputs[5] && !inputs[5].readOnly) ? parseFloat(inputs[5].value) || 0 : 0; // Hạn mức tín dụng
    const soDuToiThieu = (inputs[6] && !inputs[6].readOnly) ? parseFloat(inputs[6].value) || 0 : 0; // Số dư tối thiểu

    // Kiểm tra và in giá trị để xác minh
    console.log('Số dư:', soDu);
    console.log('Lãi suất:', laiSuat);
    console.log('Hạn mức tín dụng:', hanMucTinDung);
    console.log('Số dư tối thiểu:', soDuToiThieu);

    // Tạo đối tượng tài khoản
    const taiKhoan = {
        MaTaiKhoan: inputs[0].value,
        MaKhachHang: document.getElementById('editMaKhachHang').value,
        LoaiTaiKhoan: editingRow.getElementsByTagName('td')[2].innerText,
        SoDu: soDu,
        LaiSuat: laiSuat,
        HanMucTinDung: hanMucTinDung,
        SoDuToiThieu: soDuToiThieu
    };

    try {
        const response = await fetch(`${baseURL}api/taikhoan/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taiKhoan)
        });

        if (response.ok) {
            alert('Cập nhật tài khoản thành công!');
            layDanhSachTaiKhoan();
            editingRow = null;
            btn.innerText = 'Sửa';
            btn.setAttribute('onclick', `editTaiKhoan('${id}', this)`);
        } else {
            const error = await response.text();
            alert(`Cập nhật không thành công: ${error}`);
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}


// Hàm editTaiKhoan
async function editTaiKhoan(id, btn) {
    if (editingRow) {
        alert('Bạn đang chỉnh sửa một tài khoản khác. Vui lòng lưu hoặc hủy trước.');
        return;
    }

    // Chuyển nút thành 'Lưu'
    btn.innerText = 'Lưu';
    btn.setAttribute('onclick', `luuTaiKhoan('${id}', this)`);

    const row = btn.parentNode.parentNode;
    editingRow = row;
    row.classList.add('editing');

    // Các cột cần chỉnh sửa
    const columns = row.getElementsByTagName('td');
    const maTaiKhoan = columns[0].innerText;
    const maKhachHang = columns[1].getAttribute('data-makhachhang');
    const loaiTaiKhoan = columns[2].innerText;
    const soDu = columns[3].innerText;
    const laiSuat = columns[4].innerText;
    const hanMucTinDung = columns[5].innerText;
    const soDuToiThieu = columns[6].innerText;

    // Tạo các input
    columns[0].innerHTML = `<input type="text" value="${maTaiKhoan}" readonly>`; // Chuyển sang input text cho mã tài khoản
    
    // Tạo dropdown cho khách hàng và giữ giá trị đã chọn
    columns[1].innerHTML = `<select id="editMaKhachHang"></select>`;
    await loadKhachHangOptionsForEdit('editMaKhachHang', maKhachHang);
    
    // Hiển thị loại tài khoản như là một phần tử không thể chỉnh sửa
    columns[2].innerHTML = `<span>${loaiTaiKhoan}</span>`;

    // Tạo các input cho số dư, lãi suất, hạn mức tín dụng và số dư tối thiểu
    columns[3].innerHTML = `<input type="number" value="${soDu}" step="0.01">`; // Số dư

    // Hiện các trường tùy thuộc vào loại tài khoản
    if (loaiTaiKhoan === 'Gửi tiền') {
        columns[4].innerHTML = `<input type="number" value="${laiSuat}" step="0.01">`; // Lãi suất có thể sửa
        columns[5].innerHTML = `<input type="number" value="${hanMucTinDung}" step="0.01" readonly>`; // Hạn mức tín dụng không thể sửa
        columns[6].innerHTML = `<input type="number" value="${soDuToiThieu}" step="0.01">`; // Số dư tối thiểu có thể sửa
    } else if (loaiTaiKhoan === 'Tín dụng') {
        columns[4].innerHTML = `<input type="number" value="${laiSuat}" step="0.01" readonly>`; // Lãi suất không thể sửa
        columns[5].innerHTML = `<input type="number" value="${hanMucTinDung}" step="0.01">`; // Hạn mức tín dụng có thể sửa
        columns[6].innerHTML = `<input type="number" value="${soDuToiThieu}" step="0.01" readonly>`; // Số dư tối thiểu không thể sửa
    }
}



async function xoaTaiKhoan(id, btn) {
    // Xác nhận xóa tài khoản
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa tài khoản này không?');
    if (!confirmDelete) return;

    try {
        // Gửi yêu cầu xóa tới API
        const response = await fetch(`${baseURL}api/taikhoan/${id}`, {
            method: 'DELETE'
        });

        // Kiểm tra phản hồi từ server
        if (response.ok) {
            alert('Xóa tài khoản thành công!');
            layDanhSachTaiKhoan(); // Cập nhật lại danh sách tài khoản sau khi xóa
        } else {
            alert('Không thể xóa tài khoản!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

function resetFormTaiKhoan() {
    document.getElementById('taiKhoanForm').reset();
}

async function layDanhSachGiaoDich() {
    try {
        // Lấy danh sách giao dịch
        const responseGiaoDich = await fetch(`${baseURL}api/giaodich`);
        const dataGiaoDich = await responseGiaoDich.json();

        // Lấy danh sách tài khoản
        const responseTaiKhoan = await fetch(`${baseURL}api/taikhoan`);
        const dataTaiKhoan = await responseTaiKhoan.json();

        // Lấy danh sách khách hàng
        const responseKhachHang = await fetch(`${baseURL}api/khachhang`);
        const dataKhachHang = await responseKhachHang.json();

        // Lấy danh sách nhân viên
        const responseNhanVien = await fetch(`${baseURL}api/nhanvien`);
        const dataNhanVien = await responseNhanVien.json();

        if (responseGiaoDich.ok && responseTaiKhoan.ok && responseKhachHang.ok && responseNhanVien.ok) {
            // Tạo ánh xạ giữa mã tài khoản và mã khách hàng
            const taiKhoanMap = {};
            dataTaiKhoan.forEach(taiKhoan => {
                taiKhoanMap[taiKhoan.MaTaiKhoan] = taiKhoan.MaKhachHang; // ánh xạ mã tài khoản đến mã khách hàng
            });

            // Tạo ánh xạ giữa mã khách hàng và tên khách hàng
            const khachHangMap = {};
            dataKhachHang.forEach(khachHang => {
                khachHangMap[khachHang.MaKhachHang] = khachHang.TenKhachHang; // ánh xạ mã khách hàng đến tên khách hàng
            });

            // Tạo ánh xạ giữa mã nhân viên và tên nhân viên
            const nhanVienMap = {};
            dataNhanVien.forEach(nhanVien => {
                nhanVienMap[nhanVien.MaNhanVien] = nhanVien.TenNhanVien; // ánh xạ mã nhân viên đến tên nhân viên
            });

            let output = `
                <h3>Danh Sách Giao Dịch</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Mã Giao Dịch</th>
                            <th>Mã Tài Khoản Nguồn</th>
                            <th>Tên Tài Khoản Nguồn</th>
                            <th>Mã Tài Khoản Đích</th>
                            <th>Tên Tài Khoản Đích</th>
                            <th>Loại Giao Dịch</th>
                            <th>Số Tiền</th>
                            <th>Ngày Giao Dịch</th>
                            <th>Mã Nhân Viên</th>
                            <th>Tên Nhân Viên</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            dataGiaoDich.forEach(giaoDich => {
                // Lấy mã khách hàng từ mã tài khoản nguồn và đích
                const maKhachHangNguon = taiKhoanMap[giaoDich.MaTaiKhoanNguon];
                const maKhachHangDich = taiKhoanMap[giaoDich.MaTaiKhoanDich];

                const tenKhachHangNguon = maKhachHangNguon ? khachHangMap[maKhachHangNguon] || '' : '';
                const tenKhachHangDich = maKhachHangDich ? khachHangMap[maKhachHangDich] || '' : '';
                const tenNhanVien = nhanVienMap[giaoDich.MaNhanVien] || '';

                output += `
                    <tr id="row-${giaoDich._id}">
                        <td>${giaoDich.MaGiaoDich}</td>
                        <td>${giaoDich.MaTaiKhoanNguon || ''}</td>
                        <td>${tenKhachHangNguon}</td>
                        <td>${giaoDich.MaTaiKhoanDich || ''}</td>
                        <td>${tenKhachHangDich}</td>
                        <td>${giaoDich.LoaiGiaoDich}</td>
                        <td>${giaoDich.SoTien}</td>
                        <td>${new Date(giaoDich.NgayGiaoDich).toLocaleString('vi-VN', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            second: '2-digit' 
                        })}</td>
                        <td>${giaoDich.MaNhanVien}</td>
                        <td>${tenNhanVien}</td>
                    </tr>
                `;
            });

            output += `
                    </tbody>
                </table>
            `;
            document.getElementById('danhSachGiaoDich').innerHTML = output;
        } else {
            alert('Không thể lấy danh sách giao dịch, tài khoản, khách hàng hoặc nhân viên!');
        }
    } catch (error) {
        alert('Lỗi kết nối tới server!');
    }
}

async function layDanhSachNhanVienGiaoDich() {
    try {
        const response = await fetch(`${baseURL}api/nhanvien`);
        const data = await response.json();

        if (response.ok) {
            const selectNhanVien = document.getElementById('MaNhanVienGD');
            // Xóa các tùy chọn hiện tại
            selectNhanVien.innerHTML = `<option value="">Chọn nhân viên</option>`;
            // Thêm các nhân viên vào dropdown
            data.forEach(nhanVien => {
                selectNhanVien.innerHTML += `
                    <option value="${nhanVien.MaNhanVien}">${nhanVien.TenNhanVien}</option>
                `;
            });
        } else {
            alert('Không thể lấy danh sách nhân viên!');
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
        alert('Lỗi kết nối tới server!');
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await layDanhSachGiaoDich();
    await layDanhSachNhanVienGiaoDich(); 
});

async function layDanhSachTaiKhoanGiaoDich() {
    try {
        const response = await fetch(`${baseURL}api/taikhoan`);
        const data = await response.json();

        if (response.ok) {
            // Lưu trữ danh sách tài khoản
            return data;
        } else {
            alert('Không thể lấy danh sách tài khoản!');
            return [];
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài khoản:', error);
        alert('Lỗi kết nối tới server!');
        return [];
    }
}

function capNhatTaiKhoanNhan(selectedAccount, danhSachTaiKhoan) {
    const taiKhoanNhanSelect = document.getElementById('MaTaiKhoanNhan');
    taiKhoanNhanSelect.innerHTML = `
        <option value="">Chọn tài khoản nhận</option>
        ${danhSachTaiKhoan.map(taiKhoan => `
            <option value="${taiKhoan.MaTaiKhoan}" ${taiKhoan.MaTaiKhoan === selectedAccount ? 'disabled' : ''}>
                ${taiKhoan.MaTaiKhoan}
            </option>
        `).filter(option => option !== '').join('')}
    `;
}

async function hienThiTruong() {
    const loaiGiaoDich = document.getElementById('LoaiGiaoDich').value;
    const trongGiaoDich = document.getElementById('trongGiaoDich');
    let output = '';

    const danhSachTaiKhoan = await layDanhSachTaiKhoanGiaoDich();

    switch (loaiGiaoDich) {
        case 'NopTien':
            output = `
                <div>
                    <label for="MaTaiKhoan">Tài Khoản:</label>
                    <select id="MaTaiKhoan" required>
                        <option value="">Chọn tài khoản</option>
                        ${danhSachTaiKhoan.map(taiKhoan => `
                            <option value="${taiKhoan.MaTaiKhoan}">${taiKhoan.MaTaiKhoan}</option>
                        `).join('')}
                    </select>
                </div>
                <div>
                    <label for="SoTien">Số Tiền Nộp:</label>
                    <input type="number" id="SoTien" placeholder="Số Tiền" required>
                </div>
            `;
            break;

        case 'RutTien':
            output = `
                <div>
                    <label for="MaTaiKhoan">Tài Khoản:</label>
                    <select id="MaTaiKhoan" required>
                        <option value="">Chọn tài khoản</option>
                        ${danhSachTaiKhoan.map(taiKhoan => `
                            <option value="${taiKhoan.MaTaiKhoan}">${taiKhoan.MaTaiKhoan}</option>
                        `).join('')}
                    </select>
                </div>
                <div>
                    <label for="SoTien">Số Tiền Rút:</label>
                    <input type="number" id="SoTien" placeholder="Số Tiền" required>
                </div>
            `;
            break;

        case 'ChuyenKhoan':
            output = `
                <div>
                    <label for="MaTaiKhoanGui">Tài Khoản Gửi:</label>
                    <select id="MaTaiKhoanGui" required>
                        <option value="">Chọn tài khoản gửi</option>
                        ${danhSachTaiKhoan.map(taiKhoan => `
                            <option value="${taiKhoan.MaTaiKhoan}">${taiKhoan.MaTaiKhoan}</option>
                        `).join('')}
                    </select>
                </div>
                <div>
                    <label for="MaTaiKhoanNhan">Tài Khoản Nhận:</label>
                    <select id="MaTaiKhoanNhan" required>
                        <option value="">Chọn tài khoản nhận</option>
                        ${danhSachTaiKhoan.map(taiKhoan => `
                            <option value="${taiKhoan.MaTaiKhoan}">${taiKhoan.MaTaiKhoan}</option>
                        `).join('')}
                    </select>
                </div>
                <div>
                    <label for="SoTien">Số Tiền Chuyển Khoản:</label>
                    <input type="number" id="SoTien" placeholder="Số Tiền" required>
                </div>
            `;
            break;

        default:
            output = ''; 
    }

    trongGiaoDich.innerHTML = output;
}

async function thucHienGiaoDich() {
    const maNhanVien = document.getElementById('MaNhanVienGD').value;
    const loaiGiaoDich = document.getElementById('LoaiGiaoDich').value;
    let apiUrl, requestData;

    switch (loaiGiaoDich) {
        case 'NopTien':
            const taiKhoanNop = document.getElementById('MaTaiKhoan').value;
            const soTienNop = document.getElementById('SoTien').value;
            apiUrl = `${baseURL}api/nop-tien`;
            requestData = {
                taiKhoanDich: taiKhoanNop,
                soTien: Number(soTienNop),
                maNhanVien: maNhanVien
            };
            break;

        case 'RutTien':
            const taiKhoanRut = document.getElementById('MaTaiKhoan').value;
            const soTienRut = document.getElementById('SoTien').value;
            apiUrl = `${baseURL}api/rut-tien`;
            requestData = {
                taiKhoanNguon: taiKhoanRut,
                soTien: Number(soTienRut),
                maNhanVien: maNhanVien
            };
            break;

        case 'ChuyenKhoan':
            const taiKhoanGui = document.getElementById('MaTaiKhoanGui').value;
            const taiKhoanNhan = document.getElementById('MaTaiKhoanNhan').value;
            const soTienChuyen = document.getElementById('SoTien').value;
            apiUrl = `${baseURL}api/chuyen-khoan`;
            requestData = {
                taiKhoanNguon: taiKhoanGui,
                taiKhoanDich: taiKhoanNhan,
                soTien: Number(soTienChuyen),
                maNhanVien: maNhanVien
            };
            break;

        default:
            alert('Vui lòng chọn loại giao dịch.');
            return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            alert('Lỗi: ' + errorMessage);
            return;
        }

        const result = await response.json();
        alert(result.message);

        // Reset form
        document.getElementById('giaoDichForm').reset();
        document.getElementById('trongGiaoDich').innerHTML = '';

        // Cập nhật danh sách giao dịch thành công
        layDanhSachGiaoDich();
        layDanhSachTaiKhoan();
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        alert('Có lỗi xảy ra trong quá trình thực hiện giao dịch.');
    }
}
