import { defineStore } from "pinia";

export const initStaticDataState = defineStore("initStaticDataStateId", {
  state: () => ({
    objectData: {
      "Khu vực trồng trọt": {
        name: "Khu vực trồng trọt",
        emptyObject: {
          dien_tich: "10",
          loai_cay_trong: "Lúa nước",
          san_luong_du_kien: 5000,
          thoi_gian_thu_hoach: "2025-06-15",
        },
        objects: [
          {
            key: 1,
            dien_tich: "10",
            loai_cay_trong: "Lúa nước",
            san_luong_du_kien: 5000,
            thoi_gian_thu_hoach: "2025-06-15",
          },
          { key: 2, dien_tich: "5", loai_cay_trong: "Ngô", san_luong_du_kien: 3000, thoi_gian_thu_hoach: "2025-09-20" },
          {
            key: 3,
            dien_tich: "25",
            loai_cay_trong: "Ngô",
            san_luong_du_kien: 7000,
            thoi_gian_thu_hoach: "2025-08-10",
          },
          {
            key: 4,
            dien_tich: "16",
            loai_cay_trong: "Nước",
            san_luong_du_kien: 4500,
            thoi_gian_thu_hoach: "2025-10-05",
          },
          {
            key: 5,
            dien_tich: "16",
            loai_cay_trong: "Táo",
            san_luong_du_kien: 4500,
            thoi_gian_thu_hoach: "2025-10-05",
          },
        ],
      },
      "Vùng bảo vệ thực vật": {
        name: "Quản lý Vùng bảo vệ thực vật",
        emptyObject: {
          name: null,
          area_ha: null,
          plant_type: null,
          protection_level: null,
        },
        objects: [
          {
            key: 1,
            name: "Vùng BVTV Tây Nam",
            area_ha: 120.5,
            plant_type: "Lúa",
            protection_level: "Cao",
          },
          {
            key: 2,
            name: "Vùng BVTV Miền Trung",
            area_ha: 80.2,
            plant_type: "Ngô",
            protection_level: "Trung bình",
          },
        ],
      },
      "Hộ nông dân": {
        name: "Hộ nông dân",
        emptyObject: {
          vi_tri: null,
          dien_tich_dat: null,
          loai_cay_trong: null,
          lich_su_canh_tac: null,
          so_luong_cay_trong: null,
        },
        objects: [
          {
            key: 1,
            ten_ho: "Nguyễn Văn A",
            vi_tri: "Xã Bình An, Huyện Châu Thành, Tỉnh An Giang",
            dien_tich_dat: 2.5,
            loai_cay_trong: "Lúa nước",
            lich_su_canh_tac: [
              { nam: 2023, vu_mua: "Đông Xuân", nang_suat: 6000 },
              { nam: 2022, vu_mua: "Hè Thu", nang_suat: 5800 },
            ],
            so_luong_cay_trong: 50000,
          },
          {
            key: 2,
            ten_ho: "Trần Thị B",
            vi_tri: "Xã Mỹ Hòa, Huyện Tháp Mười, Tỉnh Đồng Tháp",
            dien_tich_dat: 3.0,
            loai_cay_trong: "Cam sành",
            lich_su_canh_tac: [
              { nam: 2023, vu_mua: "Chính vụ", nang_suat: 7000 },
              { nam: 2022, vu_mua: "Nghịch vụ", nang_suat: 6500 },
            ],
            so_luong_cay_trong: 1200,
          },
          {
            key: 3,
            ten_ho: "Lê Văn C",
            vi_tri: "Xã Phú Tân, Huyện Phú Tân, Tỉnh Cà Mau",
            dien_tich_dat: 1.8,
            loai_cay_trong: "Dừa xiêm",
            lich_su_canh_tac: [
              { nam: 2023, vu_mua: "Chính vụ", nang_suat: 5000 },
              { nam: 2022, vu_mua: "Nghịch vụ", nang_suat: 4800 },
            ],
            so_luong_cay_trong: 300,
          },
          {
            key: 4,
            ten_ho: "Phạm Thị D",
            vi_tri: "Xã Tân Lập, Huyện Mộc Hóa, Tỉnh Long An",
            dien_tich_dat: 2.2,
            loai_cay_trong: "Thanh long",
            lich_su_canh_tac: [
              { nam: 2023, vu_mua: "Chính vụ", nang_suat: 6200 },
              { nam: 2022, vu_mua: "Nghịch vụ", nang_suat: 5900 },
            ],
            so_luong_cay_trong: 1500,
          },
        ],
      },
      "Trạm bảo vệ thực vật": {
        name: "Quản lý Trạm bảo vệ thực vật",
        emptyObject: {
          name: null,
          station_name: null,
          staff_count: null,
        },
        objects: [
          {
            key: 1,
            name: "Trạm BVTV A",
            station_name: "Trạm BVTV A",
            location: {
              lat: 10.762622,
              lng: 106.660172,
            },
            staff_count: 15,
          },
          {
            key: 2,
            name: "Trạm BVTV B",
            station_name: "Trạm BVTV B",
            staff_count: 20,
          },
        ],
      },
      "Vùng Sản xuất Nông nghiệp tiêu chuẩn": {
        name: "Quản lý Vùng Sản xuất Nông nghiệp tiêu chuẩn",
        emptyObject: {
          name: null,
          standard_type: null,
          certification_year: null,
          farmers_count: null,
        },
        objects: [
          {
            key: 1,
            area_type: "Vùng SXNN GlobalGAP",
            standard_type: "GlobalGAP",
            certification_year: 2020,
            farmers_count: 50,
          },
          {
            key: 2,
            area_type: "Vùng SXNN VietGAP",
            standard_type: "VietGAP",
            certification_year: 2022,
            farmers_count: 80,
          },
        ],
      },
      "Kho lưu trữ Phân bón, Vật tư nông nghiệp": {
        name: "Quản lý Kho lưu trữ Phân bón, Vật tư nông nghiệp",
        emptyObject: {
          name: null,
          storage_capacity_ton: null,
          material_types: null,
          safety_compliance: null,
        },
        objects: [
          {
            key: 1,
            name: "Kho Phân bón Miền Nam",
            storage_capacity_ton: 500,
            material_types: "Kali",
            safety_compliance: true,
          },
          {
            key: 2,
            name: "Kho Thuốc BVTV Bắc Trung Bộ",
            storage_capacity_ton: 700,
            material_types: "Phân hữu cơ",
            safety_compliance: false,
          },
        ],
      },
      "Vùng dịch hại": {
        name: "Quản lý Vùng dịch hại",
        emptyObject: {
          name: null,
          infestation_type: null,
          affected_area_ha: null,
          control_methods: null,
        },
        objects: [
          {
            key: 1,
            name: "Vùng Dịch hại Tây Nguyên",
            infestation_type: "Sâu keo mùa thu",
            affected_area_ha: 150.3,
            control_methods: "Phun thuốc",
          },
          {
            key: 2,
            name: "Vùng Dịch hại Đồng Bằng Sông Cửu Long",
            infestation_type: "Rầy nâu",
            affected_area_ha: 90.6,
            control_methods: "Sử dụng thiên địch",
          },
        ],
      },
    },
    columns: {
      "Khu vực trồng trọt": [
        { title: "Diện tích (ha)", dataIndex: "dien_tich", key: "dien_tich" },
        { title: "Loại cây trồng", dataIndex: "loai_cay_trong", key: "loai_cay_trong" },
        { title: "Sản lượng dự kiến", dataIndex: "san_luong_du_kien", key: "san_luong_du_kien" },
        { title: "Thời gian thu hoạch", dataIndex: "thoi_gian_thu_hoach", key: "thoi_gian_thu_hoach" },
      ],
      "Vùng bảo vệ thực vật": [
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Diện tích (ha)", dataIndex: "area_ha", key: "area_ha" },
        { title: "Loại cây trồng", dataIndex: "plant_type", key: "plant_type" },
        { title: "Mức độ bảo vệ", dataIndex: "protection_level", key: "protection_level" },
      ],
      "Hộ nông dân": [
        { title: "Tên chủ hộ", dataIndex: "ten_ho", key: "ten_ho" },
        { title: "Vị trí", dataIndex: "vi_tri", key: "vi_tri" },
        { title: "Diện tích đất", dataIndex: "dien_tich_dat", key: "dien_tich_dat" },
        { title: "Loại cây trồng", dataIndex: "loai_cay_trong", key: "loai_cay_trong" },
        { title: "Lịch sử canh tác", dataIndex: "lich_su_canh_tac", key: "lich_su_canh_tac" },
        { title: "Số lượng cây trồng", dataIndex: "so_luong_cay_trong", key: "so_luong_cay_trong" },
      ],
      "Trạm bảo vệ thực vật": [
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Tên trạm", dataIndex: "station_name", key: "station_name" },
        { title: "Số lượng nhân viên", dataIndex: "staff_count", key: "staff_count" },
      ],
      "Vùng Sản xuất Nông nghiệp tiêu chuẩn": [
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Kiểu vùng tiêu chuẩn", dataIndex: "area_type", key: "area_type" },
        { title: "Số lượng nông dân", dataIndex: "farmers_count", key: "farmers_count" },
        { title: "Loại tiêu chuẩn", dataIndex: "standard_tuype", key: "standard_type" },
        { title: "Năm chứng nhận", dataIndex: "certification_year", key: "certification_year" },
      ],
      "Kho lưu trữ Phân bón, Vật tư nông nghiệp": [
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Sức chứa (tấn)", dataIndex: "storage_capacity_ton", key: "storage_capacity_ton" },
        { title: "Loại vật tư", dataIndex: "material_types", key: "material_types" },
        { title: "Tuân thủ an toàn", dataIndex: "safety_compliance", key: "safety_compliance" },
      ],
      "Vùng dịch hại": [
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Loại dịch hại", dataIndex: "infestation_type", key: "infestation_type" },
        { title: "Diện tích ảnh hưởng (ha)", dataIndex: "affected_area_ha", key: "affected_area_ha" },
        { title: "Phương pháp kiểm soát", dataIndex: "control_methods", key: "control_methods" },
      ],
    },
    layerOptions: [
      {
        value: "Khu vực trồng trọt",
        label: "Khu vực trồng trọt",
      },
      {
        value: "Vùng bảo vệ thực vật",
        label: "Vùng bảo vệ thực vật",
      },
      {
        value: "Hộ nông dân",
        label: "Hộ nông dân",
      },
      {
        value: "Trạm bảo vệ thực vật",
        label: "Trạm bảo vệ thực vật",
      },
      {
        value: "Vùng Sản xuất Nông nghiệp tiêu chuẩn",
        label: "Vùng Sản xuất Nông nghiệp tiêu chuẩn",
      },
      {
        value: "Kho lưu trữ Phân bón, Vật tư nông nghiệp",
        label: "Kho lưu trữ Phân bón, Vật tư nông nghiệp",
      },
      {
        value: "Vùng dịch hại",
        label: "Vùng dịch hại",
      },
    ],
  }),

  actions: {
    setObjectData(objectData) {
      this.objectData = objectData;
    },
    setColumns(columns) {
      this.colums = columns;
    },
    setLayerOptions(layerOptions) {
      this.layerOptions = layerOptions;
    },
  },

  getters: {
    getObjectData() {
      return this.objectData;
    },
    getColumns() {
      return this.columns;
    },
    getLayerOptions() {
      return this.layerOptions;
    },
  },
});
