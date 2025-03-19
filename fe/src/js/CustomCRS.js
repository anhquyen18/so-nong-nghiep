// import '../../node_modules/proj4/dist/proj4.js';
import { register } from 'ol/proj/proj4.js';
import { get } from 'ol/proj.js';
// import { proj4 as aqtran } from '../../node_modules/proj4/dist/proj4.js';
// import { proj4 } from 'proj4.js';
// import proj4 from 'proj4/dist/proj4.js';
// import proj4 from 'proj4.js';
// import { Proj } from 'proj4/dist/proj4.js';.

import proj4 from 'proj4';

// VN2000 Noi bo mui 3
const htd_103_nb =
  '+proj=tmerc +lat_0=0 +lon_0=103 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_104_nb =
  '+proj=tmerc +lat_0=0 +lon_0=104 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_104_5_nb =
  '+proj=tmerc +lat_0=0 +lon_0=104.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_104_75_nb =
  '+proj=tmerc +lat_0=0 +lon_0=104.75 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_105_nb =
  '+proj=tmerc +lat_0=0 +lon_0=105 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_105_5_nb =
  '+proj=tmerc +lat_0=0 +lon_0=105.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_105_75_nb =
  '+proj=tmerc +lat_0=0 +lon_0=105.75 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_106_nb =
  '+proj=tmerc +lat_0=0 +lon_0=106 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_106_25_nb =
  '+proj=tmerc +lat_0=0 +lon_0=106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_106_5_nb =
  '+proj=tmerc +lat_0=0 +lon_0=106.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_107_nb =
  '+proj=tmerc +lat_0=0 +lon_0=107 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_107_25_nb =
  '+proj=tmerc +lat_0=0 +lon_0=107.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_107_5_nb =
  '+proj=tmerc +lat_0=0 +lon_0=107.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_107_75_nb =
  '+proj=tmerc +lat_0=0 +lon_0=107.75 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_108_nb =
  '+proj=tmerc +lat_0=0 +lon_0=108 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const htd_108_25_nb =
  '+proj=tmerc +lat_0=0 +lon_0=108.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const consthtd_108_5_nb =
  '+proj=tmerc +lat_0=0 +lon_0=108.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

// VN2000 Hoi nhap mui 3
const htd_102_hn =
  '+proj=tmerc +lat_0=0 +lon_0=102 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,' +
  '-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_103_hn =
  '+proj=tmerc +lat_0=0 +lon_0=103 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 ' +
  '+towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,' +
  '-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_104_hn =
  '+proj=tmerc +lat_0=0 +lon_0=104 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_104_5_hn =
  '+proj=tmerc +lat_0=0 +lon_0=104.5 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_104_75_hn =
  '+proj=tmerc +lat_0=0 +lon_0=104.75 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_105_hn =
  '+proj=tmerc +lat_0=0 +lon_0=105 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 ' +
  '+towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,' +
  '-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_105_5_hn =
  '+proj=tmerc +lat_0=0 +lon_0=105.5 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_105_75_hn =
  '+proj=tmerc +lat_0=0 +lon_0=105.75 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_106_hn =
  '+proj=tmerc +lat_0=0 +lon_0=106 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_106_25_hn =
  '+proj=tmerc +lat_0=0 +lon_0=106.25 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_106_5_hn =
  '+proj=tmerc +lat_0=0 +lon_0=106.5 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_107_hn =
  '+proj=tmerc +lat_0=0 +lon_0=107 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_107_25_hn =
  '+proj=tmerc +lat_0=0 +lon_0=107.25 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_107_5_hn =
  '+proj=tmerc +lat_0=0 +lon_0=107.5 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_107_75_hn =
  '+proj=tmerc +lat_0=0 +lon_0=107.75 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_108_hn =
  '+proj=tmerc +lat_0=0 +lon_0=108 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_108_25_hn =
  '+proj=tmerc +lat_0=0 +lon_0=108.25 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_108_5_hn =
  '+proj=tmerc +lat_0=0 +lon_0=108.5 +k=0.9999 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';

// VN2000 Hoi nhap mui 6
const htd_105_hnm6 =
  '+proj=tmerc +lat_0=0 +lon_0=105 +k=0.9996 +x_0=500000 +y_0=0 +ellps=WGS84 ' +
  '+towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,' +
  '-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_111_hnm6 =
  '+proj=tmerc +lat_0=0 +lon_0=111 +k=0.9996 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
const htd_117_hnm6 =
  '+proj=tmerc +lat_0=0 +lon_0=117 +k=0.9996 +x_0=500000 +y_0=0 ' +
  '+ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,' +
  '0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs';
// UTM 48, 49
const htd_utm_48 = '+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs';
const htd_utm_49 = '+proj=utm +zone=49 +datum=WGS84 +units=m +no_defs';

var customCrsList = [
  // Hội nhập
  {
    name: 'VN-2000 / UTM zone 48N',
    code: 'EPSG:3405',
    proj4: htd_utm_48,
  },
  {
    name: 'VN-2000 / UTM zone 49N',
    code: 'EPSG:3406',
    proj4: htd_utm_49,
  },
  {
    name: 'VN-2000 / TM-3 102',
    code: 'EPSG:5896',
    proj4: htd_102_hn,
  },
  {
    name: 'VN-2000 / TM-3 103',
    code: 'EPSG:9205',
    proj4: htd_103_hn,
  },
  {
    name: 'VN-2000 / TM-3 104',
    code: 'EPSG:9206',
    proj4: htd_104_hn,
  },
  {
    name: 'VN-2000 / TM-3 104-30',
    code: 'EPSG:9207',
    proj4: htd_104_5_hn,
  },
  {
    name: 'VN-2000 / TM-3 104-45',
    code: 'EPSG:9208',
    proj4: htd_104_75_hn,
  },
  {
    name: 'VN-2000 / TM-3 105',
    code: 'EPSG:5897',
    proj4: htd_105_hn,
  },
  {
    name: 'VN-2000 / TM-3 105-30',
    code: 'EPSG:9209',
    proj4: htd_105_5_hn,
  },
  {
    name: 'VN-2000 / TM-3 105-45',
    code: 'EPSG:9210',
    proj4: htd_105_75_hn,
  },
  {
    name: 'VN-2000 / TM-3 106',
    code: 'EPSG:9211',
    proj4: htd_106_hn,
  },
  {
    name: 'VN-2000 / TM-3 106-15',
    code: 'EPSG:9212',
    proj4: htd_106_25_hn,
  },
  {
    name: 'VN-2000 / TM-3 106-30',
    code: 'EPSG:9213',
    proj4: htd_106_5_hn,
  },
  {
    name: 'VN-2000 / TM-3 107',
    code: 'EPSG:9214',
    proj4: htd_107_hn,
  },
  {
    name: 'VN-2000 / TM-3 107-15',
    code: 'EPSG:9215',
    proj4: htd_107_25_hn,
  },
  {
    name: 'VN-2000 / TM-3 107-30',
    code: 'EPSG:9216',
    proj4: htd_107_5_hn,
  },
  {
    name: 'VN-2000 / TM-3 107-45',
    code: 'EPSG:5899',
    proj4: htd_107_75_hn,
  },
  {
    name: 'VN-2000 / TM-3 108',
    code: 'EPSG:5898',
    proj4: htd_108_hn,
  },
  {
    name: 'VN-2000 / TM-3 108-15',
    code: 'EPSG:9217',
    proj4: htd_108_25_hn,
  },
  {
    name: 'VN-2000 / TM-3 108-30',
    code: 'EPSG:9218',
    proj4: htd_108_5_hn,
  },
];

function addCustomCrs(name) {
  var projection;
  customCrsList.forEach((element) => {
    if (formatCrsName(name) === formatCrsName(element.name) || formatCrsCode(name) === formatCrsCode(element.code)) {
      proj4.defs(element.code, element.proj4);
      // Proj.defs(element.code, element.proj4);

      // ol.proj.proj4.register(proj4);
      // projection = ol.proj.get(element.code);
      register(proj4);
      projection = get(element.code);
    }
  });
  return projection;
}

function formatCrsName(name) {
  return name.toLocaleLowerCase().replace(/\s+/g, '');
}

function formatCrsCode(code) {
  return code.toLocaleLowerCase();
}

export { addCustomCrs };
