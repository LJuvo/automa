export type Site = {
  id: string;
  name: string;
  code: string;
  capacity: string;
  capacityNum: number;
  flow: number;
  flowUnit: string;
  status: 'normal' | 'alarm' | 'offline';
  waterQuality: number;
  equipmentRate: number;
  alarms: number;
  x: number;
  y: number;
  processes: ProcessStep[];
};

export type ProcessStep = {
  id: string;
  name: string;
  pageCode: string;
  icon: string;
  params: ProcessParam[];
  hasFuture?: boolean;
};

export type ProcessParam = {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'low' | 'high' | 'offline';
};

export const sites: Site[] = [
  {
    id: 'jianchun',
    name: '建春污水处理厂一期',
    code: 'B02',
    capacity: '2.0万 m³/d',
    capacityNum: 2,
    flow: 620,
    flowUnit: 'm³/h',
    status: 'normal',
    waterQuality: 100,
    equipmentRate: 98.2,
    alarms: 0,
    x: 220,
    y: 280,
    processes: [
      { id: 'inlet', name: '进水泵站', pageCode: 'C01', icon: 'pump', params: [
        { name: '液位', value: '3.2', unit: 'm', status: 'normal' },
        { name: '进水流量', value: '620', unit: 'm³/h', status: 'normal' },
      ]},
      { id: 'grid', name: '格栅', pageCode: 'C01', icon: 'grid', params: [
        { name: '前后液位差', value: '0.05', unit: 'm', status: 'normal' },
      ]},
      { id: 'sediment', name: '沉砂池', pageCode: 'C02', icon: 'basin', params: [
        { name: '停留时间', value: '30', unit: 'min', status: 'normal' },
      ]},
      { id: 'bio', name: '生化池(A²/O)', pageCode: 'C03', icon: 'tank', params: [
        { name: 'DO', value: '2.0', unit: 'mg/L', status: 'normal' },
        { name: 'MLSS', value: '3150', unit: 'mg/L', status: 'normal' },
      ]},
      { id: 'blower', name: '鼓风曝气', pageCode: 'C04', icon: 'blower', params: [
        { name: '出口压力', value: '0.06', unit: 'MPa', status: 'normal' },
      ]},
      { id: 'settle', name: '二沉池', pageCode: 'C05', icon: 'basin', params: [
        { name: '回流比', value: '80', unit: '%', status: 'normal' },
      ]},
      { id: 'dosing', name: '加药系统', pageCode: 'C06', icon: 'dosing', params: [
        { name: 'PAC流量', value: '4.2', unit: 'L/h', status: 'normal' },
      ]},
      { id: 'disinfect', name: '消毒系统', pageCode: 'C07', icon: 'disinfect', params: [
        { name: '余氯', value: '0.8', unit: 'mg/L', status: 'normal' },
      ]},
      { id: 'monitor', name: '出水监测', pageCode: '', icon: 'monitor', params: [
        { name: 'COD', value: '25', unit: 'mg/L', status: 'normal' },
        { name: '氨氮', value: '0.8', unit: 'mg/L', status: 'normal' },
      ]},
    ],
  },
  {
    id: 'jinfeng',
    name: '金风梅园污水处理厂',
    code: 'B03',
    capacity: '3.0万 m³/d',
    capacityNum: 3,
    flow: 860,
    flowUnit: 'm³/h',
    status: 'normal',
    waterQuality: 100,
    equipmentRate: 97.8,
    alarms: 1,
    x: 380,
    y: 180,
    processes: [
      { id: 'inlet', name: '进水泵站', pageCode: 'C01', icon: 'pump', params: [
        { name: '液位', value: '3.0', unit: 'm', status: 'normal' },
      ]},
      { id: 'bio1', name: '生化池1#区', pageCode: 'C03', icon: 'tank', params: [
        { name: 'DO', value: '2.0', unit: 'mg/L', status: 'normal' },
      ]},
      { id: 'bio2', name: '生化池2#区', pageCode: 'C03', icon: 'tank', params: [
        { name: 'DO', value: '2.1', unit: 'mg/L', status: 'normal' },
      ]},
      { id: 'blower', name: '鼓风机房', pageCode: 'C04', icon: 'blower', params: [
        { name: '总风量', value: '180', unit: 'm³/min', status: 'normal' },
      ]},
      { id: 'dewater', name: '污泥脱水', pageCode: 'C08', icon: 'dewater', params: [
        { name: '处理量', value: '12', unit: 'm³/h', status: 'normal' },
      ]},
    ],
  },
  {
    id: 'shashi',
    name: '沙石污水处理厂',
    code: 'B04',
    capacity: '2.0万 m³/d（远期3万）',
    capacityNum: 2,
    flow: 580,
    flowUnit: 'm³/h',
    status: 'alarm',
    waterQuality: 100,
    equipmentRate: 94.5,
    alarms: 3,
    x: 140,
    y: 180,
    processes: [
      { id: 'inlet', name: '进水泵站', pageCode: 'C01', icon: 'pump', params: [
        { name: '液位', value: '3.5', unit: 'm', status: 'normal' },
      ]},
      { id: 'sediment', name: '沉砂池', pageCode: 'C02', icon: 'basin', params: [] },
      { id: 'bio', name: '生化池(A²/O)', pageCode: 'C03', icon: 'tank', params: [
        { name: 'DO', value: '1.2', unit: 'mg/L', status: 'low' },
        { name: 'MLSS', value: '2980', unit: 'mg/L', status: 'normal' },
      ]},
      { id: 'blower', name: '鼓风机房', pageCode: 'C04', icon: 'blower', params: [
        { name: '出口压力', value: '0.055', unit: 'MPa', status: 'normal' },
      ]},
    ],
  },
  {
    id: 'rongjiang',
    name: '蓉江新区污水处理厂二期',
    code: 'B05',
    capacity: '4.0万 m³/d（远期16万）',
    capacityNum: 4,
    flow: 1240,
    flowUnit: 'm³/h',
    status: 'normal',
    waterQuality: 100,
    equipmentRate: 96.5,
    alarms: 1,
    x: 350,
    y: 380,
    processes: [
      { id: 'inlet', name: '进水泵站(4泵)', pageCode: 'C01', icon: 'pump', params: [
        { name: '液位', value: '3.2', unit: 'm', status: 'normal' },
        { name: '进水流量', value: '1240', unit: 'm³/h', status: 'normal' },
      ]},
      { id: 'bio1', name: '生化池1#A²/O', pageCode: 'C03', icon: 'tank', params: [
        { name: 'DO', value: '2.0', unit: 'mg/L', status: 'normal' },
        { name: 'MLSS', value: '3150', unit: 'mg/L', status: 'normal' },
        { name: 'ORP', value: '-235', unit: 'mV', status: 'normal' },
      ]},
      { id: 'bio2', name: '生化池2#A²/O', pageCode: 'C03', icon: 'tank', params: [
        { name: 'DO', value: '2.1', unit: 'mg/L', status: 'normal' },
      ]},
      { id: 'blower', name: '鼓风机房(4台)', pageCode: 'C04', icon: 'blower', params: [
        { name: '出口压力', value: '0.062', unit: 'MPa', status: 'normal' },
        { name: '总风量', value: '180', unit: 'm³/min', status: 'normal' },
      ]},
      { id: 'settle', name: '二沉池(2组)', pageCode: 'C05', icon: 'basin', params: [
        { name: '回流流量', value: '620', unit: 'm³/h', status: 'normal' },
        { name: '剩余污泥', value: '15', unit: 'm³/h', status: 'normal' },
      ]},
      { id: 'filter', name: '深度处理', pageCode: '', icon: 'filter', params: [
        { name: '滤池水位', value: '4.2', unit: 'm', status: 'normal' },
      ]},
      { id: 'dosing', name: '加药(PAC+碳源+PAM)', pageCode: 'C06', icon: 'dosing', params: [
        { name: 'PAC流量', value: '8.5', unit: 'L/h', status: 'normal' },
      ]},
      { id: 'disinfect', name: '消毒', pageCode: 'C07', icon: 'disinfect', params: [
        { name: '余氯', value: '1.0', unit: 'mg/L', status: 'normal' },
      ]},
      { id: 'monitor', name: '出水监测(8项)', pageCode: '', icon: 'monitor', params: [
        { name: 'COD', value: '25', unit: 'mg/L', status: 'normal' },
        { name: '氨氮', value: '0.8', unit: 'mg/L', status: 'normal' },
        { name: 'pH', value: '7.2', unit: '', status: 'normal' },
      ]},
    ],
  },
  {
    id: 'shuidong',
    name: '水东再生水厂',
    code: 'B06',
    capacity: '2.5万 m³/d（远期5万）',
    capacityNum: 2.5,
    flow: 680,
    flowUnit: 'm³/h',
    status: 'normal',
    waterQuality: 100,
    equipmentRate: 95.2,
    alarms: 0,
    x: 480,
    y: 260,
    processes: [
      { id: 'pump1', name: '1#泵站', pageCode: 'C10', icon: 'pump', params: [
        { name: '液位', value: '2.8', unit: 'm', status: 'normal' },
        { name: '流量', value: '250', unit: 'm³/h', status: 'normal' },
      ]},
      { id: 'pump2', name: '2#泵站', pageCode: 'C10', icon: 'pump', params: [
        { name: '液位', value: '2.2', unit: 'm', status: 'normal' },
      ]},
      { id: 'pump3', name: '3#泵站', pageCode: 'C10', icon: 'pump', params: [
        { name: '液位', value: '1.5', unit: 'm', status: 'normal' },
      ]},
      { id: 'bio', name: '生化池', pageCode: 'C03', icon: 'tank', params: [
        { name: 'DO', value: '1.9', unit: 'mg/L', status: 'normal' },
      ]},
    ],
  },
  {
    id: 'baitao',
    name: '白塔污泥处理处置中心',
    code: 'B07',
    capacity: '土建200/设备100吨/d',
    capacityNum: 0,
    flow: 100,
    flowUnit: '吨/d',
    status: 'normal',
    waterQuality: 0,
    equipmentRate: 92.0,
    alarms: 0,
    x: 260,
    y: 450,
    processes: [
      { id: 'sludge_in', name: '污泥进料', pageCode: 'C09', icon: 'inlet', params: [
        { name: '进料泵', value: '运行', unit: '', status: 'normal' },
      ]},
      { id: 'filter', name: '压滤机', pageCode: 'C09', icon: 'filter', params: [
        { name: '当前步骤', value: '2/7', unit: '', status: 'normal' },
      ]},
      { id: 'dosing', name: 'PAM加药', pageCode: 'C09', icon: 'dosing', params: [
        { name: '药箱液位', value: '1.5', unit: 'm', status: 'normal' },
      ]},
      { id: 'scale', name: '汽车衡', pageCode: 'C09', icon: 'scale', params: [
        { name: '当前称重', value: '2.1', unit: '吨', status: 'normal' },
        { name: '当日累计', value: '48', unit: '吨', status: 'normal' },
      ]},
    ],
  },
];

export const kpiData = {
  totalFlow: '13.2万m³/d',
  totalFlowTrend: '+2.1%',
  waterQuality: 100,
  waterQualityTrend: '持平',
  equipmentRate: 96.5,
  equipmentRateTrend: '+0.3%',
  energyPerUnit: '0.319 kWh/m³',
  energyTrend: '-1.2%',
  alarmCount: 3,
  alarmTrend: '新增 1',
};

export type Alarm = {
  id: string;
  level: '紧急' | '重要' | '次要' | '提示';
  levelCode: 4 | 3 | 2 | 1;
  time: string;
  site: string;
  location: string;
  description: string;
  currentValue?: string;
  setValue?: string;
  status: '活跃' | '已确认' | '已屏蔽';
  operator?: string;
};

export const alarms: Alarm[] = [
  {
    id: 'ALM-20260818-001',
    level: '紧急', levelCode: 4,
    time: '2026-08-18 10:23:15',
    site: '沙石污水处理厂',
    location: '生化池2区',
    description: 'DO偏低',
    currentValue: '1.2 mg/L',
    setValue: '≥ 1.5 mg/L',
    status: '活跃',
  },
  {
    id: 'ALM-20260818-002',
    level: '重要', levelCode: 3,
    time: '2026-08-18 09:45:22',
    site: '蓉江新区污水处理厂二期',
    location: '鼓风机房',
    description: '1#鼓风机振动偏高',
    currentValue: '4.8 mm/s',
    setValue: '≤ 4.5 mm/s',
    status: '已确认',
    operator: '张工',
  },
  {
    id: 'ALM-20260818-003',
    level: '重要', levelCode: 3,
    time: '2026-08-18 08:30:00',
    site: '沙石污水处理厂',
    location: '粗格栅',
    description: '前后液位差偏高',
    currentValue: '0.28 m',
    setValue: '≤ 0.20 m',
    status: '活跃',
  },
  {
    id: 'ALM-20260818-004',
    level: '次要', levelCode: 2,
    time: '2026-08-18 07:12:33',
    site: '建春污水处理厂一期',
    location: '加药系统',
    description: 'PAC药箱液位偏低',
    currentValue: '0.8 m',
    setValue: '≥ 1.0 m',
    status: '已确认',
    operator: '李工',
  },
  {
    id: 'ALM-20260818-005',
    level: '提示', levelCode: 1,
    time: '2026-08-18 06:00:00',
    site: '白塔污泥处理处置中心',
    location: '污泥进料',
    description: 'PAM药箱需补充',
    status: '活跃',
  },
  {
    id: 'ALM-20260817-006',
    level: '重要', levelCode: 3,
    time: '2026-08-17 22:15:00',
    site: '金风梅园污水处理厂',
    location: '二沉池',
    description: '回流泵自动跳停',
    status: '已屏蔽',
    operator: '系统',
  },
  {
    id: 'ALM-20260817-007',
    level: '紧急', levelCode: 4,
    time: '2026-08-17 18:40:00',
    site: '水东再生水厂',
    location: '1#泵站',
    description: '液位超高报警已处理',
    status: '已确认',
    operator: '张工',
  },
];

export type DeviceItem = {
  id: string;
  name: string;
  type: string;
  site: string;
  mode: '自动' | '手动';
  status: '运行' | '停止' | '故障' | '投运' | '就绪';
  frequency?: string;
  runHours: number;
  protection: string;
};

export const devices: DeviceItem[] = [
  { id: 'P-001', name: '1#提升泵', type: '离心泵', site: '蓉江新区再生水厂', mode: '自动', status: '运行', frequency: '42.5Hz', runHours: 1860, protection: '液位联锁OK' },
  { id: 'P-002', name: '2#提升泵', type: '离心泵', site: '蓉江新区再生水厂', mode: '自动', status: '运行', frequency: '41.8Hz', runHours: 1842, protection: '液位联锁OK' },
  { id: 'P-003', name: '3#提升泵', type: '离心泵', site: '蓉江新区再生水厂', mode: '自动', status: '停止', runHours: 0, protection: '备用' },
  { id: 'P-004', name: '4#提升泵', type: '离心泵', site: '蓉江新区再生水厂', mode: '自动', status: '运行', frequency: '42.0Hz', runHours: 1780, protection: '液位联锁OK' },
  { id: 'B-001', name: '1#鼓风机', type: '罗茨风机', site: '蓉江新区再生水厂', mode: '自动', status: '运行', frequency: '38Hz', runHours: 2150, protection: '出口压力联锁' },
  { id: 'B-002', name: '2#鼓风机', type: '罗茨风机', site: '蓉江新区再生水厂', mode: '自动', status: '运行', frequency: '40Hz', runHours: 2100, protection: '出口压力联锁' },
  { id: 'B-003', name: '3#鼓风机', type: '罗茨风机', site: '蓉江新区再生水厂', mode: '自动', status: '停止', runHours: 0, protection: '备用' },
  { id: 'B-004', name: '4#鼓风机', type: '罗茨风机', site: '蓉江新区再生水厂', mode: '自动', status: '运行', frequency: '42Hz', runHours: 2080, protection: '出口压力联锁' },
];

export type TrendPoint = { time: string; value: number; setValue?: number; unit?: string };

export const trendData: TrendPoint[] = [
  { time: '06:00', value: 1.8, setValue: 2.0 },
  { time: '07:00', value: 1.9, setValue: 2.0 },
  { time: '08:00', value: 2.0, setValue: 2.0 },
  { time: '09:00', value: 2.1, setValue: 2.0 },
  { time: '10:00', value: 2.2, setValue: 2.0 },
  { time: '11:00', value: 2.1, setValue: 2.0 },
  { time: '12:00', value: 2.0, setValue: 2.0 },
  { time: '13:00', value: 1.9, setValue: 2.0 },
  { time: '14:00', value: 1.8, setValue: 2.0 },
  { time: '15:00', value: 1.9, setValue: 2.0 },
  { time: '16:00', value: 2.0, setValue: 2.0 },
  { time: '17:00', value: 2.1, setValue: 2.0 },
];

export type User = {
  id: string;
  username: string;
  name: string;
  organization: string;
  role: string;
  phone: string;
  status: '启用' | '禁用';
  createdAt: string;
};

export const users: User[] = [
  { id: 'u01', username: 'zhanggong', name: '张工', organization: '蓉江新区二期', role: '工程师', phone: '138****5678', status: '启用', createdAt: '2025-03-15' },
  { id: 'u02', username: 'ligong', name: '李工', organization: '沙石厂', role: '工程师', phone: '139****1234', status: '启用', createdAt: '2025-04-20' },
  { id: 'u03', username: 'wangcaozuo', name: '王操作', organization: '建春站', role: '操作员', phone: '137****9988', status: '启用', createdAt: '2025-05-10' },
  { id: 'u04', username: 'zhaoadmin', name: '赵管理', organization: '运维部', role: '管理员', phone: '136****7766', status: '启用', createdAt: '2025-01-01' },
  { id: 'u05', username: 'chenbrowse', name: '陈浏览', organization: '水质组', role: '浏览者', phone: '135****4321', status: '启用', createdAt: '2025-06-15' },
  { id: 'u06', username: 'liuoperator', name: '刘操作', organization: '金风梅园污水厂', role: '操作员', phone: '134****5678', status: '禁用', createdAt: '2025-07-01' },
  { id: 'u07', username: 'sunengineer', name: '孙工', organization: '水东厂', role: '工程师', phone: '133****9999', status: '启用', createdAt: '2025-08-20' },
  { id: 'u08', username: 'zhouengineer', name: '周工', organization: '白塔厂', role: '工程师', phone: '132****8888', status: '启用', createdAt: '2025-09-10' },
];

export const quickLinks = [
  { icon: 'Map', name: '全厂总览', code: 'B01' },
  { icon: 'TrendingUp', name: '趋势分析', code: 'D03' },
  { icon: 'FileText', name: '报表管理', code: 'D04' },
  { icon: 'Wrench', name: '设备台账', code: 'D09' },
  { icon: 'Bell', name: '报警管理', code: 'D01' },
  { icon: 'Settings', name: '系统配置', code: 'A08' },
];

export const announcements = [
  { id: 'a1', title: '关于9月停机检修的通知', date: '2026-08-15', content: '为保障设备安全稳定运行，计划于2026年9月20日0:00-24:00进行全厂停机检修。涉及所有工艺单元，请各值班人员提前做好相关准备工作。' },
  { id: 'a2', title: 'OPC UA升级公告', date: '2026-08-10', content: 'OPC UA服务已升级至v2.5版本，新增订阅模式，数据刷新周期优化至500ms。' },
  { id: 'a3', title: '新版《操作流程》已发布', date: '2026-08-01', content: '新版《污水处理厂操作规程》v3.0已发布，请各厂组织学习。' },
];
