function getEleId(id){
    return document.getElementById(id);
}

// Tạo mảng 

// Hằng số định nghĩa const và không dấu kép
const giaUber_X = [8000 , 12000 , 10000];
const giaCho_Uber_X = 2000;
const giaUber_Suv = [9000 , 14000 , 112000];
const giaCho_Uber_Suv = 3000;
const giaUber_Black = [10000 , 16000 , 14000];
const giaCho_Uber_Black = 4000;

function chonLoaiXe(){
    var uberX = getEleId("uberX");
    var uberSuv = getEleId("uberSUV");
    var uberBlack = getEleId("uberBlack");
    // sử dụng checked để kiểm tra có chọn tick không
    if (uberX.checked){
        return "uberX";
    }
    else if(uberSuv.checked){
        return "uberSuv";
    }
    else if(uberBlack.checked){
        return "uberBlack";
    }
}

function tinhTienThoiGianCho(thoiGian,gia){
    var tongTienCho = 0;
    // bởi vì trên 3 phút mới tính tiền thời gian chờ, và 3 phút mới tính thời gian chờ 1 lần (có nghĩa là chờ 3 phút thì cộng tiền nhưng 4,5,6 phút thì không cộng thêm mà bằng giá với 3 phút, 7 phút cộng thêm tiền,8,9,10 thì bằng giá với 7 phút) nên thời gian chờ chia cho 3 và làm tròn.
    if (thoiGian >= 3){
        tongTienCho = Math.round(thoiGian/3.0) * gia;
        // tongTienCho = thoiGian * gia;
    }
    return tongTienCho;
}

function tinhTongTien(giaKm,km,thoiGian,gia){
    var tongTienCho = tinhTienThoiGianCho(thoiGian,gia);
    if (km <= 1){
        // Giá km đầu tiên + tiền chờ
        return giaKm[0] + tongTienCho;
    }
    else if(km >1 && km <= 20){
        // Giá km đầu tiên + giá của 19 km còn lại + tiền chờ
        return giaKm[0] + (km -1)*giaKm[1] + tongTienCho;
    }
    else if(km > 20){
        // vì đi trên 20km nên, Giá km đầu tiên + giá của 19 km tiếp theo là phải có + giá của km còn lại (lấy tổng km đi trừ đi 20 km trước) + tiền chờ
        return giaKm[0] + 19*giaKm[1] + (km-20)*giaKm[2] + tongTienCho;
    }
}

function thanhToanTien(){
    var km = getEleId("soKM").value;    // giá trị nhập đầu vào của hàm tính tổng tiền
    // km = parseFloat(soKM);  // đổi về giá trị float
    var thoiGian = getEleId("thoiGianCho").value;       // giá trị nhập đầu vào của hàm tính tổng tiền
    // thoiGian = parseFloat(thoiGianCho);  // đổi về giá trị float

    var tongTienThanhToan = 0;
    var loaiXe = chonLoaiXe();      // gọi đến function chọn xe phía trên để set switch

    switch(loaiXe){
        case "uberX":   
        tongTienThanhToan = tinhTongTien(giaUber_X,km,thoiGian,giaCho_Uber_X);
        break;
        case "uberSuv":   
        tongTienThanhToan = tinhTongTien(giaUber_Suv,km,thoiGian,giaCho_Uber_Suv);
        break;
        case "uberBlack":   
        tongTienThanhToan = tinhTongTien(giaUber_Black,km,thoiGian,giaCho_Uber_Black);
        break;
        default:    
        alert ("Vui Lòng Chọn Loại Xe");
    }
    return tongTienThanhToan;
}

getEleId("btnTinhTien").onclick = function(){
    var tongTien = thanhToanTien();
    getEleId("divThanhTien").style.display = "Block";
    getEleId("xuatTien").innerHTML = tongTien;
}


/* ---------------------------------------------------------------------------- */

function renderHoaDonQuangDuong(loaiXe,arrayKm,arrayGiaKm,tblBody){  // Loại xe, số km, bảng giá km, tblBody là id của phần body trong hóa đơn 
    //! Vì số km tương ứng sẽ hiện số hàng trong hóa đơn khác nhau, dưới 1km thì chỉ hiện 1 hàng giá 1km đầu tiên, còn trên 20km sẽ hiện 3 vùng giá khác nhau trên 3 hàng, bởi vì sẽ k biết ng dùng nhập vào ở vùng giá nào nên sẽ dùng for để quét hết độ dài của km
    //TODO: Tạo ra vòng lặp for để tạo ra quét hết giá trị của arrayKm để xác định thành 1 mảng có 3 phần tử tương ứng với 3 vùng giá của km đi được, phần đầu tiên là dưới 1km,1km-20km,trên 20km
    //TODO: arrayKm = [ 1 , 2-20 , (km -20)];
    for (var i = 0; i < arrayKm.length; i++){
        //TODO: Tạo ra <tr> là tạo ra 1 hàng ngang
        var trQuangDuong = document.createElement("tr");

        //TODO: Tạo ra 4 cái td là 4 thành phần trong 1 hàng
        var tdChiTiet = document.createElement("td");
        var tdSuDung = document.createElement("td");
        var tdDonGia = document.createElement("td");
        var tdThanhTien = document.createElement("td");

        //TODO: Thực hiện gán dữ liệu cho 4 thành phần trên
        tdChiTiet.innerHTML = loaiXe;
        tdSuDung.innerHTML = arrayKm[i] + "KM";
        tdDonGia.innerHTML = arrayGiaKm[i] + "VND";      //* Giá của km tương ứng, nếu i = 0 thì sẽ hiển thị uberX, 1 hiển thị SUV, 2 hiển thị Black
        tdThanhTien.innerHTML = arrayKm[i] * arrayGiaKm[i] + "VND";     //* thành tiền sẽ bằng quãng đường nhân giá km, khi đi 15km => lúc đầu i = 0 => arrayKm[0] * arrayGiakm[0] là lấy 1km đầu nhân với giá 1km đầu => tính được tiền 1km đầu => sau đó i = 1 => lấy quãng đường 14km còn lại nhân với vùng giá (1-20) km.  
        //* bởi vì kích thước mảng arrayGiaKm cũng có 3 phần giống mảng arrayKm nên sử dụng chung thứ i được

        //TODO: Đặt vô vị trí hiển thị cho các thẻ trên, vị trí hiển thị tại thẻ <tr>
        trQuangDuong.appendChild(tdChiTiet);
        trQuangDuong.appendChild(tdSuDung);
        trQuangDuong.appendChild(tdDonGia);
        trQuangDuong.appendChild(tdThanhTien);

        //TODO: Đặt vô vị trí hiển thị cho thẻ <tr>, thẻ <tr> hiển thị trong thẻ chứ id tblBody
        tblBody.appendChild(trQuangDuong);

    }
}

function renderHoaDonThoiGianCho(thoiGianCho,giaThoiGianCho,tblBody){
    // var tienCho = tinhTienCho(thoiGianCho,giaThoiGianCho);

    //TODO: Tạo ra <tr> là 1 hàng
    var trThoiGianCho = document.createElement("tr");   

    //TODO: tạo ra 4 thành phần trong hàng thời gian chờ
    var tdTitle = document.createElement("td");
    var tdthoiGianCho = document.createElement("td");
    var tdgiaThoiGianCho = document.createElement("td");
    var tdThanhTien = document.createElement("td");

    //TODO: Thực hiện gán dữ liệu cho 4 thành phần trên
    tdTitle.innerHTML = "Thời Gian Chờ";
    tdthoiGianCho.innerHTML = thoiGianCho + "Phút";
    tdgiaThoiGianCho.innerHTML = giaThoiGianCho + "Phút";      
    tdThanhTien.innerHTML = thoiGianCho * giaThoiGianCho + "VND";  

    //TODO: Đặt vô vị trí hiển thị cho các thẻ trên, vị trí hiển thị tại thẻ <tr>
    trThoiGianCho.appendChild(tdTitle);
    trThoiGianCho.appendChild(tdthoiGianCho);
    trThoiGianCho.appendChild(tdgiaThoiGianCho);
    trThoiGianCho.appendChild(tdThanhTien);

    //TODO: Đặt vô vị trí hiển thị cho thẻ <tr>, thẻ <tr> hiển thị trong thẻ chứ id tblBody
    tblBody.appendChild(trThoiGianCho);

}

function renderTongCong(tongTien){
    //TODO: Tạo ra <tr> là 1 hàng
    var trTotal = document.createElement("tr");
    //TODO: Tạo ra 1 class có nền xanh cho thẻ hàng ngang tổng cộng này, dựa vào class của bootstrap
    trTotal.className = "alert alert-success"

    //TODO: tạo ra 2 thành phần trong hàng thời gian chờ
    var tdTotal = document.createElement("td");
    //* Bởi vì hàng thổng tiền dưới cùng trống 2 cột sử dụng và đơn giá so với các hàng hóa đơn phía trên, nên sẽ gom 3 cột đó thành 1 cột, hàng này sẽ từ 4 cột như ban đầu và trở thành 2 cột, sử dụng can thiệp vào thuộc tính 
    tdTotal.setAttribute("colspan" , 3);
    var tdTongCong = document.createElement("td");

    //TODO: Thực hiện gán dữ liệu cho 2 thành phần trên
    tdTotal.innerHTML = "Tổng Tiền Phải Trả";
    tdTongCong.innerHTML = tongTien +"VND";  

    //TODO: Đặt vô vị trí hiển thị cho các thẻ trên, vị trí hiển thị tại thẻ <tr>
    trTotal.appendChild(tdTotal);
    trTotal.appendChild(tdTongCong);

    //TODO: Đặt vô vị trí hiển thị cho thẻ <tr>, thẻ <tr> hiển thị trong thẻ chứ id tblBody
    tblBody.appendChild(trTotal);

}

function inHoaDon(loaiXe,arrayKm,arrayGiaKm,thoiGianCho,giaThoiGianCho,tongTien){

        var km = getEleId("soKM").value;
    //* Reset thẻ tblBody
    var tblBody = getEleId("tblBody");
    tblBody.innerHTML = "";  // để khoảng trắng để reset thẻ, bởi vì 1 pop up nếu ấn in hóa đơn nhiều lần sẽ làm cộng dồn giá trị bởi vì sử dụng append là push giá trị vô cuối, bởi vậy phải reset lại popup mỗi khi tắt hóa đơn

    // Viết điều kiện để chạy chương trình km
    if (km <= 1){
        renderHoaDonQuangDuong(loaiXe,[1],arrayGiaKm,tblBody);  // Tại vị trí arrayKm, thực hiện tạo mảng có 1 phần tử là số 1 ở bên trong renderHoaDonQuangDuong()
    }
    else if(km >1 && km <= 20){
        renderHoaDonQuangDuong(loaiXe,[1 , km -1],arrayGiaKm,tblBody);    // Tạo mảng có 2 phần tử là [1 , (km -1)]
    }
    else if(km > 20){
        renderHoaDonQuangDuong(loaiXe,[1 , 19 , km -20],arrayGiaKm,tblBody);    // Tạo mảng có 3 phần tử là [1 , 19 , km -20]
    }

    // Viết điều kiện để chạy chương trình thời gian chờ
    if (thoiGianCho >= 3){
        renderHoaDonThoiGianCho(thoiGianCho,giaThoiGianCho,tblBody);
    }

    // Viết chương trình tính tổng tiền 
    renderTongCong(tongTien,tblBody);
}

//! var km = getEleId("soKM").value; var thoiGian = getEleId("thoiGianCho").value; , Khi sử dụng lấy dữ liệu mà thực đi thực lại nhiều lần, chúng ta có thể viết thành 1 hàm, để push các dữ liệu lấy được thành 1 mảng, sau đó gọi ra sử dụng thuận tiện hơn tránh trường hợp gọi đi gọi lại trong nhiều hàm khác nhau  
function getData(){
    //* Tạo mảng để push dữ liệu vào 
    var data = [];
    var km = getEleId("soKM").value;  
    data.push(km);
    var thoiGian = getEleId("thoiGianCho").value;
    data.push(thoiGian);

    //* để gọi ra sử dụng chỉ cần gọi data[0] sẽ tương ứng với km = document.getElementById("soKM").value

    return data;
}

getEleId("btnInHD").onclick = function(){
    // Thực hiện chạy hàm inhoas đơn
    var data = getData();   // Chạy hàm lấy giá trị cho hàm in hóa đơn
    var tongTien = thanhToanTien();
    var loaiXe = chonLoaiXe();  // Chạy làm chọn loại xe để set điều kiện để chạy hàm in hóa đơn
    switch (loaiXe){
        case "uberX":
            inHoaDon(loaiXe,data[0],giaUber_X,data[1],giaCho_Uber_X,tongTien);
        break;
        case "uberSuv":
            inHoaDon(loaiXe,data[0],giaUber_Suv,data[1],giaCho_Uber_Suv,tongTien);
        break;
        case "uberBlack":
            inHoaDon(loaiXe,data[0],giaUber_Black,data[1],giaCho_Uber_Black,tongTien);
        break;
        default:
            alert ("Vui Lòng Chọn Loại Xe");
    }
}