import { Vector as VectorSource, XYZ as XYZSource, OSM as OSMSource, TileJSON as TileJSONSource } from "ol/source.js";
import { Vector as VectorLayer, Tile as TileLayer, Group as LayerGroup } from "ol/layer.js";
import { Style, Icon, Stroke, Circle, Fill, Text } from "ol/style.js";
import CircleStyle from "ol/style/Circle";
import { MultiPoint } from "ol/geom";
import { GeoJSON } from "ol/format.js";
import ol_interaction_Hover from "ol-ext/interaction/Hover.js";

const runMap = (map) => {
  // var map;
  const GEOSERVER_DOMAIN = import.meta.env.VITE_APP_GEOSERVER_DOMAIN;
  const GEOSERVER_WORKSPACE = import.meta.env.VITE_APP_GEOSERVER_WORKSPACE;

  const meterBounds = [531992, 1768417, 549908, 1778754];
  const maxMeterBounds = [532967, 1768419, 550882, 1778756];
  const maptilerKey = import.meta.env.VITE_APP_MAPTILER_KEY;
  // ---------------------------------
  // ----------Map Layer--------------
  // ---------------------------------
  var baseLayerGroup = new LayerGroup({
    title: "Base layers",
    // openInLayerSwitcher: true,
    layers: [
      new TileLayer({
        title: "Google Map",
        baseLayer: true,
        preload: Infinity,
        type: "base",
        visible: false,
        source: new XYZSource({
          url: "https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga",
          crossOrigin: "anonymous",
        }),
      }),
      // new TileLayer({
      //   preload: Infinity,
      //   title: 'Water Color',
      //   baseLayer: true,
      //   visible: false,
      //   source: new StamenSource({ layer: 'watercolor', attributions: [], attributionsCollapsible: false }),
      // }),
      new TileLayer({
        preload: Infinity,
        title: "Toner",
        baseLayer: true,
        visible: false,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/toner-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: "anonymous",
        }),
      }),
      new TileLayer({
        preload: Infinity,
        baseLayer: true,
        source: new OSMSource({
          attributions: [],
          attributionsCollapsible: false,
        }),
        visible: false,
        title: "Open Street Map",
      }),
      new TileLayer({
        title: "Topo Map",
        baseLayer: true,
        preload: Infinity,
        type: "base",
        visible: false,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/topo-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: "anonymous",
        }),
      }),
      new TileLayer({
        title: "Streets Map",
        baseLayer: true,
        preload: Infinity,
        type: "base",
        visible: true,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: "anonymous",
        }),
      }),
      new TileLayer({
        baseLayer: true,
        visible: false,
        title: "No Basemap",
      }),
    ],
  });

  // Tuỳ chỉnh icon style của các main layer theo mức zoom
  const iconStyleFunction = function (feature, resolution, iconUrl, scaleFactor = 0.001) {
    const zoom = map.getView().getZoom(); // Lấy mức zoom hiện tại
    const scale = zoom * scaleFactor; // Tính scale dựa trên zoom (tăng dần khi zoom lớn hơn)
    // const scale = initScale + zoom * 0.001; // Tính scale dựa trên zoom (tăng dần khi zoom lớn hơn)
    return new Style({
      image: new Icon({
        anchor: [0.5, 1], // Điểm neo của icon
        src: iconUrl,
        scale: scale, // Áp dụng scale
      }),
    });
  };

  const layerIcons = {
    hoNongDanLayer: {
      //https://www.svgrepo.com/svg/358528/house-user
      iconUrl: "/icon/ho-nong-dan-icon.svg",
      scale: 0.003,
    },
    tramBaoVeThucVatLayer: {
      //https://www.svgrepo.com/svg/495096/building-4
      iconUrl: "/icon/tram-bao-ve-thuc-vat-icon.svg",
      scale: 0.003,
    },
    khoLuuTruPhanBonVaVatTuNongNghiepLayer: {
      //https://www.svgrepo.com/svg/308885/store-inventory-inventory-stock-supply
      iconUrl: "/icon/kho-luu-tru-phan-bon-va-vat-tu-nong-nghiep-icon.svg",
      scale: 0.0025,
    },
    diemLayMauLayer: {
      //https://www.svgrepo.com/svg/429878/injection-inject-vaccine
      iconUrl: "/icon/diem-lay-mau.svg",
      scale: 0.0025,
    },
    doanhNghiepLamThuySanLayer: {
      //https://www.svgrepo.com/svg/513181/building?edit=true
      //#ff4d4d
      iconUrl: "/icon/dnlts.svg",
      scale: 0.0025,
    },
  };

  const khuVucTrongTrotLayer = new VectorLayer({
    title: "Khu vực trồng trọt",
    preview: "/luffy-chilling-gear5-round.png",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Akhu_vuc_trong_trot&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: (feature, resolution) => {
      const items = [
        {
          iconUrl: "/legend-icon/kvtt-rice-128.png",
          color: "rgba(29, 144, 238, 0.8)",
        },
        {
          iconUrl: "/legend-icon/kvtt-corn-128.png",
          color: "rgba(235, 191, 18, 0.8)",
        },
        {
          iconUrl: "/legend-icon/kvtt-others-128.png",
          color: "rgba(16, 194, 55, 0.8)",
        },
      ];
      const zoom = map.getView().getZoom();
      const scale = (zoom + 2) * 0.01;
      const type = JSON.parse(feature.get("datafields")).loai_cay_trong;
      // Xác định màu sắc và icon dựa trên giá trị của trường 'loai_cay_trong'
      let fillColor;
      let icon;
      switch (type) {
        case "Lúa nước":
          fillColor = items[0].color;
          icon = items[0].iconUrl;
          break;
        case "Ngô":
          fillColor = items[1].color;
          icon = items[1].iconUrl;
          break;
        default:
          fillColor = items[2].color;
          icon = items[2].iconUrl;
          break;
      }
      return [
        new Style({
          stroke: new Stroke({
            color: "grey",
            width: 1,
          }),
          fill: new Fill({
            color: fillColor,
          }),
        }),
        new Style({
          image: new Icon({
            anchor: [0.5, 1], // Điểm neo của icon
            src: icon,
            scale: scale, // Áp dụng scale
          }),
          geometry: function (feature) {
            // return the coordinates of the first ring of the polygon
            const coordinates = feature.getGeometry().getCoordinates()[0];
            return new MultiPoint(coordinates);
          },
        }),
      ];
    },
  });

  const vungBaoVeThucVatLayer = new VectorLayer({
    title: "Vùng bảo vệ thực vật",
    preview: "/luffy-chilling-gear5-round.png",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Avung_bao_ve_thuc_vat&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: function (feature) {
      const status = JSON.parse(feature.get("datafields")).tinh_trang;
      // Hàm xác định màu sắc dựa trên giá trị của trường 'standard_type'
      let fillColor;
      if (status == 4) {
        fillColor = "rgba(215, 0, 0, 1)";
      } else if (status == 3) {
        fillColor = "rgb(156, 94, 0)";
      } else {
        fillColor = "rgb(0, 92, 8)";
      }

      return new Style({
        fill: new Fill({
          color: fillColor, // Màu sắc dựa trên 'standard_type'
        }),
        stroke: new Stroke({
          color: "g",
          width: 1,
        }),
      });
    },
  });

  const hoNongDanLayer = new VectorLayer({
    title: "Hộ nông dân",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Aho_nong_dan&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: (feature, resolution) =>
      iconStyleFunction(
        feature,
        resolution,
        layerIcons.hoNongDanLayer.iconUrl,
        layerIcons.khoLuuTruPhanBonVaVatTuNongNghiepLayer.scale,
      ),
  });

  const tramBaoVeThucVatLayer = new VectorLayer({
    title: "Trạm bảo vệ thực vật",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Atram_bao_ve_thuc_vat&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: (feature, resolution) =>
      iconStyleFunction(
        feature,
        resolution,
        layerIcons.tramBaoVeThucVatLayer.iconUrl,
        layerIcons.tramBaoVeThucVatLayer.scale,
      ),
  });

  const vungSanXuatNongNgiepTieuChuanLayer = new VectorLayer({
    title: "Vùng Sản xuất Nông nghiệp tiêu chuẩn",
    // preview: "/luffy-chilling-gear5-round.png",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Avung_san_xuat_nong_nghiep_tieu_chuan&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: function (feature) {
      const standardType = JSON.parse(feature.get("datafields")).standard_type;
      // Hàm xác định màu sắc dựa trên giá trị của trường 'standard_type'
      let fillColor;
      switch (standardType) {
        case "GlobalGAP":
          fillColor = "rgba(0, 255, 0, 0.6)"; // Màu xanh cho GlobalGAP
          break;
        case "VietGAP":
          fillColor = "rgba(255, 0, 0, 0.6)"; // Màu đỏ cho VietGAP
          break;
        default:
          fillColor = "rgba(0, 0, 255, 0.6)"; // Màu xanh dương mặc định
          break;
      }

      return new Style({
        fill: new Fill({
          color: fillColor, // Màu sắc dựa trên 'standard_type'
        }),
        text: new Text({
          text: standardType,
        }),
        stroke: new Stroke({
          color: "#C6CDDE",
          width: 1,
        }),
      });
    },
  });

  const khoLuuTruPhanBonVaVatTuNongNghiepLayer = new VectorLayer({
    title: "Kho lưu trữ Phân bón, Vật tư nông nghiệp",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Akho_luu_tru_phan_bon_va_vat_tu_nong_nghiep&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: (feature, resolution) =>
      iconStyleFunction(
        feature,
        resolution,
        layerIcons.khoLuuTruPhanBonVaVatTuNongNghiepLayer.iconUrl,
        layerIcons.hoNongDanLayer.scale,
      ),
  });

  const vungDichHaiLayer = new VectorLayer({
    title: "Vùng dịch hại",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Avung_dich_hai&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: "grey",
        width: 1,
      }),
      fill: new Fill({
        color: "#1ca9c9",
      }),
    }),
  });

  // Chi cục chăn nuôi thú y--------------------------------------------------
  //  --------------------------------------------------
  //  --------------------------------------------------
  const coSoChanNuoiLayer = new VectorLayer({
    title: "Cơ sở chăn nuôi",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Aco_so_chan_nuoi&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: (feature, resolution) => {
      const items = [
        // #fe9494
        {
          //https://www.svgrepo.com/svg/481143/cow-face?edit=true
          iconUrl: "/icon/cscn-cow-256.png",
        },
        {
          //https://www.svgrepo.com/svg/481159/pig
          iconUrl: "/icon/cscn-pig-256.png",
        },
        {
          //https://www.svgrepo.com/svg/368244/chicken?edit=true
          iconUrl: "/icon/cscn-chicken-256.png",
        },
        {
          // https://www.svgrepo.com/svg/476193/animal-footprint
          iconUrl: "/icon/cscn-animal-256.png",
        },
      ];
      const zoom = map.getView().getZoom();
      const scale = (zoom + 2) * 0.008;
      const type = JSON.parse(feature.get("datafields")).loai_vat_nuoi;
      // Xác định icon dựa trên giá trị của trường 'loai_vat_nuoi'
      let icon;
      switch (type) {
        case "Bò sữa":
          icon = items[0].iconUrl;
          break;
        case "Gà công nghiệp":
          icon = items[2].iconUrl;
          break;
        case "Heo giống":
          icon = items[1].iconUrl;
          break;
        default:
          icon = items[3].iconUrl;
          break;
      }
      return new Style({
        image: new Icon({
          anchor: [0.5, 1], // Điểm neo của icon
          src: icon,
          scale: scale, // Áp dụng scale
        }),
      });
    },
  });

  const oDichChanNuoiLayer = new VectorLayer({
    title: "Ổ dịch chăn nuôi",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Ao_dich_chan_nuoi&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: "grey",
        width: 1,
      }),
      fill: new Fill({
        color: "#ff0000",
      }),
    }),

    style: function (feature) {
      const type = JSON.parse(feature.get("datafields")).loai_dich_benh;
      return new Style({
        text: new Text({
          text: type,
        }),
        stroke: new Stroke({
          color: "grey",
          width: 1,
        }),
        fill: new Fill({
          color: "#ff0000",
        }),
      });
    },
  });

  const vungAnToanChanNuoiLayer = new VectorLayer({
    title: "Vùng an toàn chăn nuôi",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Avung_an_toan_chan_nuoi&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: "grey",
        width: 1,
      }),
      fill: new Fill({
        color: "#2bff00",
      }),
    }),
  });

  const diemLayMauLayer = new VectorLayer({
    title: "Điểm lấy mẫu",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Adiem_lay_mau&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: (feature, resolution) =>
      iconStyleFunction(feature, resolution, layerIcons.diemLayMauLayer.iconUrl, layerIcons.diemLayMauLayer.scale),
  });

  const tuyenDuongVanChuyenDongVatLayer = new VectorLayer({
    title: "Tuyến đường vận chuyển động vật",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Atuyen_duong_van_chuyen_dong_vat&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: "#A100FF",
        width: 2,
      }),
    }),
  });

  // Quản lý Chất lượng nông lâm và thuỷ sản------------------------------
  //  --------------------------------------------------
  //  --------------------------------------------------
  const doanhNghiepLamThuySanLayer = new VectorLayer({
    title: "Doanh nghiệp lâm thuỷ sản",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Adoanh_nghiep_lam_thuy_san&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: (feature, resolution) =>
      iconStyleFunction(
        feature,
        resolution,
        layerIcons.doanhNghiepLamThuySanLayer.iconUrl,
        layerIcons.doanhNghiepLamThuySanLayer.scale,
      ),
  });

  const vungThuySanLayer = new VectorLayer({
    title: "Vùng thuỷ sản",
    source: new VectorSource({
      url:
        GEOSERVER_DOMAIN +
        GEOSERVER_WORKSPACE +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        GEOSERVER_WORKSPACE +
        "%3Avung_thuy_san&outputFormat=application%2Fjson",
      format: new GeoJSON(),
    }),
    style: (feature, resolution) => {
      const color = "#060270";
      const items = [
        {
          //https://www.svgrepo.com/svg/500132/fish
          iconUrl: "/icon/vts-fish.svg",
        },
        {
          //https://www.svgrepo.com/svg/10900/clam
          iconUrl: "/icon/vts-prawn.svg",
        },
        {
          //https://www.svgrepo.com/svg/232000/prawn-shrimp
          iconUrl: "/icon/vts-clam.svg",
        },
      ];
      const zoom = map.getView().getZoom();
      const scale = zoom * 0.002;
      const type = JSON.parse(feature.get("datafields")).loai_thuy_san;
      // Xác định màu sắc và icon dựa trên giá trị của trường 'loai_thuy_san'
      let icon;
      switch (type) {
        case "Nghêu":
          icon = items[2].iconUrl;
          break;
        case "Tôm":
          icon = items[1].iconUrl;
          break;
        default:
          icon = items[0].iconUrl;
          break;
      }
      return [
        new Style({
          stroke: new Stroke({
            color: "grey",
            width: 1,
          }),
          fill: new Fill({
            color: color,
          }),
        }),
        new Style({
          image: new Icon({
            anchor: [0.5, 1], // Điểm neo của icon
            src: icon,
            scale: scale, // Áp dụng scale
          }),
          geometry: function (feature) {
            // return the coordinates of the first ring of the polygon
            const coordinates = feature.getGeometry().getCoordinates()[0];
            return new MultiPoint(coordinates);
          },
        }),
      ];
    },
  });

  // Gom nhóm các layer chính
  var mainLayerGroup = new LayerGroup({
    title: "Main layers",
    layers: [
      khuVucTrongTrotLayer,
      vungBaoVeThucVatLayer,
      hoNongDanLayer,
      tramBaoVeThucVatLayer,
      vungSanXuatNongNgiepTieuChuanLayer,
      khoLuuTruPhanBonVaVatTuNongNghiepLayer,
      vungDichHaiLayer,
      coSoChanNuoiLayer,
      oDichChanNuoiLayer,
      vungAnToanChanNuoiLayer,
      diemLayMauLayer,
      tuyenDuongVanChuyenDongVatLayer,
      doanhNghiepLamThuySanLayer,
      vungThuySanLayer,
    ],
  });
  map.addLayer(baseLayerGroup);
  map.addLayer(mainLayerGroup);
  map.getView().fit(meterBounds, map.getSize());

  // ---------------------------------
  // ----------Các chắc năng và layer bổ trợ--------------
  // ---------------------------------

  // Hover object của layer
  var hover = new ol_interaction_Hover({ cursor: "pointer" });
  map.addInteraction(hover);

  // Các style cho các layer bổ trợ
  var highlightLabelStyles = {
    MultiLineString: new Style({
      stroke: new Stroke({
        color: "blue",
        width: 4,
      }),
    }),
    LineString: new Style({
      stroke: new Stroke({
        color: "blue",
        width: 4,
      }),
    }),
    Point: new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: "pink",
        }),
        stroke: new Stroke({
          color: "white",
          width: 1,
        }),
      }),
    }),
    MultiPolygon: new Style({
      stroke: new Stroke({
        color: "blue",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(243, 138, 138, 0.5)",
      }),
    }),
    Polygon: new Style({
      stroke: new Stroke({
        color: "blue",
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(243, 138, 138, 0.5)",
      }),
    }),
    Circle: new Style({
      stroke: new Stroke({
        color: "cyan",
        width: 1,
      }),
      fill: new Fill({
        color: "rgba(243, 138, 138, 0.5)",
      }),
    }),
  };

  var stylePopupFunction = function (feature) {
    return highlightLabelStyles[feature.getGeometry().getType()];
  };

  // Tạo layer hiển thị kết quả tìm kiếm
  const searchLayer = new VectorLayer({
    title: "Search hightlight layer",
    source: new VectorSource(),
    style: stylePopupFunction,
  });

  map.addLayer(searchLayer);

  // ----------Measure control-------------
  // Tạo layer cha hiển thị kết quả đo lường
  // Chỉ tạo layer, xử lý đo lường ở component measure tool
  const measureVector = new VectorLayer({
    title: "Measure layer",
    // source: measureSource,
    // style: function (feature) {
    //   return measureStyleFunction(feature, true);
    // },
  });
  // map.addInteraction(measureModify);
  map.addLayer(measureVector);

  // ----------Geolocation control-------------
  // Có thể dùng thư viện nhưng tự custom có thể tuỳ chỉnh và tối ưu hơn
  const geolocationStyle = {
    Point: new Style({
      image: new Icon({
        anchor: [0.5, 0.5], // Điểm neo của icon
        src: "/icon/geolocation.svg",
        scale: 0.3,
      }),
    }),
    Circle: new Style({
      stroke: new Stroke({
        color: "#6ec531",
        width: 1,
      }),
      fill: new Fill({
        color: "rgba(255,255,255, 0.5)",
      }),
    }),
  };
  const geolocationLayer = new VectorLayer({
    title: "Geolocation layer",
    source: new VectorSource(),
    style: (feature) => {
      return geolocationStyle[feature.getGeometry().getType()];
    },
  });
  map.addLayer(geolocationLayer);
};

export default runMap;
