const baseTours = [
  {
    destination: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80",
    basePrice: 4990000,
    duration: "3 ngày 2 đêm",
    promo: "Giảm 10%",
    suitable: "phù hợp khách thích biển, nghỉ dưỡng, đi ngắn ngày",
    hotel: "Khách sạn 3 sao gần biển"
  },
  {
    destination: "Phú Quốc",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80",
    basePrice: 6500000,
    duration: "4 ngày 3 đêm",
    promo: "Tặng vé cáp treo",
    suitable: "phù hợp khách thích nghỉ dưỡng biển đảo",
    hotel: "Resort/khách sạn 4 sao"
  },
  {
    destination: "Sapa",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
    basePrice: 2990000,
    duration: "2 ngày 1 đêm",
    promo: "Giảm 300.000đ",
    suitable: "phù hợp khách thích núi, khí hậu mát, chi phí thấp",
    hotel: "Homestay hoặc khách sạn 2-3 sao"
  },
  {
    destination: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    basePrice: 3200000,
    duration: "3 ngày 2 đêm",
    promo: "Tặng buffet sáng",
    suitable: "phù hợp cặp đôi, nhóm bạn và gia đình",
    hotel: "Khách sạn 3 sao trung tâm"
  },
  {
    destination: "Nha Trang",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    basePrice: 5900000,
    duration: "3 ngày 2 đêm",
    promo: "Giảm 8%",
    suitable: "phù hợp khách thích biển, đảo và vui chơi",
    hotel: "Khách sạn gần biển"
  },
  {
    destination: "Hạ Long",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
    basePrice: 4200000,
    duration: "2 ngày 1 đêm",
    promo: "Tặng vé du thuyền",
    suitable: "phù hợp khách muốn tham quan vịnh ngắn ngày",
    hotel: "Khách sạn 3 sao"
  },
  {
    destination: "Thái Lan",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80",
    basePrice: 8900000,
    duration: "5 ngày 4 đêm",
    promo: "Tặng bảo hiểm du lịch",
    suitable: "phù hợp khách muốn đi nước ngoài giá vừa phải",
    hotel: "Khách sạn 3-4 sao"
  },
  {
    destination: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80",
    basePrice: 12900000,
    duration: "4 ngày 3 đêm",
    promo: "Giảm 1.000.000đ",
    suitable: "phù hợp khách thích thành phố hiện đại",
    hotel: "Khách sạn 3 sao"
  },
  {
    destination: "Hàn Quốc",
    image: "https://images.unsplash.com/photo-1538485399081-7c8edbd4f0c2?auto=format&fit=crop&w=900&q=80",
    basePrice: 16900000,
    duration: "5 ngày 4 đêm",
    promo: "Tặng sim 4G",
    suitable: "phù hợp khách thích văn hóa, mua sắm, cảnh đẹp",
    hotel: "Khách sạn 3-4 sao"
  },
  {
    destination: "Nhật Bản",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
    basePrice: 24900000,
    duration: "6 ngày 5 đêm",
    promo: "Tặng vé tham quan",
    suitable: "phù hợp khách thích trải nghiệm cao cấp",
    hotel: "Khách sạn 3-4 sao"
  }
];

const products = [];

for (let i = 1; i <= 100; i++) {
  const base = baseTours[(i - 1) % baseTours.length];
  const packageLevel = Math.ceil(i / 10);
  const price = base.basePrice + packageLevel * 150000;
  const competitorPrice = price + 400000 + packageLevel * 50000;

  products.push({
    id: i,
    sku: `TS-${String(i).padStart(3, "0")}`,
    name: `Tour ${base.destination} ${base.duration} - Gói ${packageLevel}`,
    destination: base.destination,
    price: price,
    oldPrice: price + 700000,
    duration: base.duration,
    promo: base.promo,
    image: base.image,
    rating: (4.2 + (i % 8) / 10).toFixed(1),
    sold: 20 + i * 3,
    hotel: base.hotel,
    transport: i % 2 === 0 ? "Máy bay/xe du lịch" : "Xe du lịch chất lượng cao",
    startLocation: i % 2 === 0 ? "Hà Nội" : "TP. Hồ Chí Minh",
    description: `Tour ${base.destination} ${base.duration} được thiết kế cho khách hàng muốn có chuyến đi tiện lợi, tiết kiệm và nhiều trải nghiệm đáng nhớ.`,
    includes: [
      base.hotel,
      "Xe đưa đón theo lịch trình",
      "Vé tham quan theo chương trình",
      "Hướng dẫn viên du lịch",
      "Bảo hiểm du lịch"
    ],
    excludes: [
      "Chi phí cá nhân",
      "Đồ uống ngoài chương trình",
      "VAT nếu khách yêu cầu xuất hóa đơn",
      "Phụ thu phòng đơn nếu có"
    ],
    schedule: [
      "Ngày 1: Khởi hành, nhận phòng, tham quan địa điểm chính.",
      "Ngày 2: Tham quan, trải nghiệm ẩm thực, vui chơi tự do.",
      "Ngày cuối: Mua sắm, trả phòng, trở về điểm xuất phát."
    ],
    suitable: base.suitable,
    competitor: {
      name: `TravelGo ${base.destination}`,
      price: competitorPrice,
      duration: base.duration,
      includes: "Khách sạn, xe đưa đón, hướng dẫn viên",
      advantage: "TravelSmart có giá tốt hơn, AI tư vấn trực tiếp từng sản phẩm, hỗ trợ đặt tour nhanh và lưu đơn hàng tự động."
    }
  });
}

function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + "đ";
}