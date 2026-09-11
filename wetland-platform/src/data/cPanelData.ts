import type { OperationPanelData } from '@/components/hmi/OperationPanelTemplate';

const baseTrend = (key: string, base: number, variance = 0.3) =>
  Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: +(base + Math.sin(i / 3 + key.length) * variance + (Math.random() - 0.5) * variance).toFixed(2),
  }));

export const cPanelData: Record<string, OperationPanelData> = {
  c01: {
    code: 'c01',
    title: '进水泵站及格栅',
    subtitle: 'HMI 第3级 · 提升泵与格栅控制',
    params: [
      { name: '调节池液位', current: '3.2', unit: 'm', setValue: '2.5~3.5', status: 'normal' },
      { name: '进水流量', current: '1240', unit: 'm³/h', status: 'normal' },
      { name: '粗格栅前后液位差', current: '0.05', unit: 'm', setValue: '≤0.20', status: 'normal' },
      { name: '细格栅前后液位差', current: '0.03', unit: 'm', setValue: '≤0.15', status: 'normal' },
      { name: '1#提升泵累计运行', current: '1860', unit: 'h', status: 'normal' },
      { name: '2#提升泵累计运行', current: '1842', unit: 'h', status: 'normal' },
      { name: '3#提升泵累计运行', current: '0', unit: 'h', status: 'normal' },
    ],
    devices: [
      { id: 'P1', name: '1#提升泵', mode: '自动', status: '运行', frequency: '42.5Hz', runHours: 1860, protection: '液位联锁OK' },
      { id: 'P2', name: '2#提升泵', mode: '自动', status: '运行', frequency: '41.8Hz', runHours: 1842, protection: '液位联锁OK' },
      { id: 'P3', name: '3#提升泵', mode: '自动', status: '停止', runHours: 0, protection: '备用' },
      { id: 'G1', name: '粗格栅', mode: '自动', status: '运行', runHours: 3520, protection: '液位差联锁' },
      { id: 'G2', name: '细格栅', mode: '自动', status: '运行', runHours: 3510, protection: '液位差联锁' },
    ],
    interlocks: [
      { name: '提升泵启动允许', condition: '调节池液位 ≥ 1.5m', satisfied: true },
      { name: '高液位联锁停泵', condition: '液位 ≥ 3.8m 自动停', satisfied: true },
      { name: '格栅启动允许', condition: '1#提升泵运行', satisfied: true },
      { name: '就地/远程', condition: '远程控制权', satisfied: true },
    ],
    trend: { title: '调节池液位 · 近24小时', unit: 'm', data: baseTrend('c01', 3.2, 0.4), setValue: 3.2 },
  },

  c02: {
    code: 'c02',
    title: '沉砂池',
    subtitle: '排砂与曝气控制',
    params: [
      { name: '进水流量', current: '1240', unit: 'm³/h', status: 'normal' },
      { name: '停留时间', current: '30', unit: 'min', setValue: '20~40', status: 'normal' },
      { name: '曝气压力', current: '0.05', unit: 'MPa', setValue: '0.04~0.06', status: 'normal' },
      { name: '1#排砂阀累计开', current: '1240', unit: '次', status: 'normal' },
      { name: '2#排砂阀累计开', current: '1215', unit: '次', status: 'normal' },
      { name: '池内液位', current: '2.8', unit: 'm', setValue: '2.5~3.0', status: 'normal' },
    ],
    devices: [
      { id: 'V1', name: '1#排砂阀', mode: '自动', status: '运行', runHours: 0, protection: '定时排砂' },
      { id: 'V2', name: '2#排砂阀', mode: '自动', status: '停止', runHours: 0, protection: '定时排砂' },
      { id: 'B1', name: '1#曝气阀', mode: '自动', status: '运行', runHours: 720, protection: '压力联锁' },
      { id: 'B2', name: '2#曝气阀', mode: '自动', status: '运行', runHours: 720, protection: '压力联锁' },
    ],
    interlocks: [
      { name: '曝气启动', condition: '进水流量 ≥ 500 m³/h', satisfied: true },
      { name: '排砂定时触发', condition: '每 4h 一次，持续 2min', satisfied: true },
      { name: '高压停曝气', condition: '压力 ≥ 0.07 MPa', satisfied: true },
    ],
    trend: { title: '沉砂池液位 · 近24小时', unit: 'm', data: baseTrend('c02', 2.8, 0.2), setValue: 2.8 },
  },

  c03: {
    code: 'c03',
    title: '生化池 (A²/O)',
    subtitle: '核心页面 · DO-PID 与回流控制',
    params: [
      { name: 'DO 1#区', current: '2.0', unit: 'mg/L', setValue: '2.0', status: 'normal' },
      { name: 'DO 2#区', current: '2.1', unit: 'mg/L', setValue: '2.0', status: 'normal' },
      { name: 'MLSS', current: '3150', unit: 'mg/L', setValue: '2500~3500', status: 'normal' },
      { name: 'ORP 缺氧区', current: '-235', unit: 'mV', setValue: '-300~-100', status: 'normal' },
      { name: '出水 COD', current: '25', unit: 'mg/L', setValue: '≤40', status: 'normal' },
      { name: '出水氨氮', current: '0.8', unit: 'mg/L', setValue: '≤2.0', status: 'normal' },
      { name: '回流比', current: '80', unit: '%', setValue: '50~150', status: 'normal' },
      { name: '鼓风总量', current: '180', unit: 'm³/min', status: 'normal' },
    ],
    devices: [
      { id: 'P1', name: '回流泵 1#', mode: '自动', status: '运行', frequency: '38Hz', runHours: 2150, protection: 'PID+流量联锁' },
      { id: 'P2', name: '回流泵 2#', mode: '自动', status: '运行', frequency: '36Hz', runHours: 2100, protection: 'PID+流量联锁' },
      { id: 'P3', name: '剩余污泥泵', mode: '自动', status: '运行', frequency: '25Hz', runHours: 980, protection: 'MLSS联锁' },
      { id: 'D1', name: 'DO-PID 回路', mode: '自动', status: '投运', runHours: 8760, protection: '与鼓风机联动' },
    ],
    interlocks: [
      { name: 'DO 低于 1.5 mg/L', condition: '自动加大鼓风', satisfied: true },
      { name: '回流启动允许', condition: '1#鼓风机运行', satisfied: true },
      { name: '剩余污泥排泥', condition: 'MLSS ≥ 3500 mg/L', satisfied: true },
      { name: 'ORP 低限报警', condition: '< -350 mV', satisfied: true },
    ],
    trend: { title: 'DO 2#区 · 近24小时', unit: 'mg/L', data: baseTrend('c03', 2.0, 0.4), setValue: 2.0 },
  },

  c04: {
    code: 'c04',
    title: '鼓风曝气群控',
    subtitle: '4台鼓风机群控策略 · 压力/DO双PID',
    params: [
      { name: '出口压力', current: '0.062', unit: 'MPa', setValue: '0.06', status: 'normal' },
      { name: '总风量', current: '180', unit: 'm³/min', status: 'normal' },
      { name: 'DO 1#A²/O', current: '2.0', unit: 'mg/L', status: 'normal' },
      { name: 'DO 2#A²/O', current: '2.1', unit: 'mg/L', status: 'normal' },
      { name: '管网压力', current: '0.045', unit: 'MPa', status: 'normal' },
    ],
    devices: [
      { id: 'B1', name: '1#鼓风机', mode: '自动', status: '运行', frequency: '38Hz', runHours: 2150, protection: '压力+电流' },
      { id: 'B2', name: '2#鼓风机', mode: '自动', status: '运行', frequency: '40Hz', runHours: 2100, protection: '压力+电流' },
      { id: 'B3', name: '3#鼓风机', mode: '自动', status: '运行', frequency: '42Hz', runHours: 2080, protection: '压力+电流' },
      { id: 'B4', name: '4#鼓风机', mode: '自动', status: '停止', runHours: 0, protection: '备用轮值' },
    ],
    interlocks: [
      { name: '压力过高保护', condition: '≥ 0.075 MPa 停小泵', satisfied: true },
      { name: '压力过低启泵', condition: '< 0.05 MPa 启备泵', satisfied: true },
      { name: '电流过载', condition: '≥ 额定 110% 跳停', satisfied: true },
      { name: 'DO 双 PID 投运', condition: 'DO 偏差 ±0.3', satisfied: true },
    ],
    trend: { title: '出口压力 · 近24小时', unit: 'MPa', data: baseTrend('c04', 0.062, 0.008), setValue: 0.06 },
  },

  c05: {
    code: 'c05',
    title: '二沉池及回流',
    subtitle: '回流比与排泥控制',
    params: [
      { name: '回流流量', current: '620', unit: 'm³/h', status: 'normal' },
      { name: '剩余污泥流量', current: '15', unit: 'm³/h', status: 'normal' },
      { name: '回流比', current: '80', unit: '%', setValue: '50~150', status: 'normal' },
      { name: '池面液位 1#', current: '3.8', unit: 'm', status: 'normal' },
      { name: '池面液位 2#', current: '3.7', unit: 'm', status: 'normal' },
      { name: '刮泥机电流', current: '4.2', unit: 'A', status: 'normal' },
    ],
    devices: [
      { id: 'P1', name: '1#回流泵', mode: '自动', status: '运行', frequency: '36Hz', runHours: 2150, protection: '流量联锁' },
      { id: 'P2', name: '2#回流泵', mode: '自动', status: '运行', frequency: '38Hz', runHours: 2100, protection: '流量联锁' },
      { id: 'P3', name: '剩余污泥泵', mode: '自动', status: '运行', runHours: 980, protection: '定时+MLSS' },
      { id: 'S1', name: '1#刮泥机', mode: '自动', status: '运行', runHours: 3520, protection: '电流联锁' },
      { id: 'S2', name: '2#刮泥机', mode: '自动', status: '运行', runHours: 3500, protection: '电流联锁' },
    ],
    interlocks: [
      { name: '回流泵启停', condition: '液位 ≥ 2.5m 启 / ≥ 4.2m 停', satisfied: true },
      { name: '排泥定时', condition: '每日 02:00 ~ 03:00', satisfied: true },
      { name: '刮泥机故障', condition: '电流 ≥ 8A 告警', satisfied: true },
    ],
    trend: { title: '回流流量 · 近24小时', unit: 'm³/h', data: baseTrend('c05', 620, 40) },
  },

  c06: {
    code: 'c06',
    title: '加药系统',
    subtitle: 'PAC + 碳源 + PAM 投加',
    params: [
      { name: 'PAC 投加流量', current: '8.5', unit: 'L/h', setValue: '6~12', status: 'normal' },
      { name: 'PAC 药箱液位', current: '1.2', unit: 'm', setValue: '≥ 0.5', status: 'normal' },
      { name: '碳源投加流量', current: '12.0', unit: 'L/h', status: 'normal' },
      { name: '碳源药箱液位', current: '1.5', unit: 'm', status: 'normal' },
      { name: 'PAM 投加流量', current: '0.8', unit: 'L/h', status: 'normal' },
      { name: 'PAM 药箱液位', current: '1.0', unit: 'm', status: 'low' },
    ],
    devices: [
      { id: 'P1', name: 'PAC 计量泵', mode: '自动', status: '运行', frequency: '40Hz', runHours: 3500, protection: '液位联锁' },
      { id: 'P2', name: '碳源计量泵', mode: '自动', status: '运行', frequency: '35Hz', runHours: 3420, protection: '液位联锁' },
      { id: 'P3', name: 'PAM 计量泵', mode: '自动', status: '运行', runHours: 3500, protection: '液位联锁' },
      { id: 'A1', name: 'PAC 搅拌器', mode: '自动', status: '运行', runHours: 8760, protection: '连续运行' },
    ],
    interlocks: [
      { name: '低液位停泵', condition: '药箱 < 0.3m 停泵', satisfied: true },
      { name: '流量联动', condition: '按进水流量比例投加', satisfied: true },
      { name: 'PAM 需补充', condition: '液位 < 0.8m 弹窗', satisfied: true },
    ],
    trend: { title: 'PAC 投加流量 · 近24小时', unit: 'L/h', data: baseTrend('c06', 8.5, 2) },
  },

  c07: {
    code: 'c07',
    title: '消毒系统',
    subtitle: '比例投加 + 余氯反馈',
    params: [
      { name: '余氯', current: '0.8', unit: 'mg/L', setValue: '0.5~1.5', status: 'normal' },
      { name: '进水流量', current: '1240', unit: 'm³/h', status: 'normal' },
      { name: '消毒剂投加量', current: '15.0', unit: 'L/h', status: 'normal' },
      { name: '消毒剂液位', current: '1.8', unit: 'm', status: 'normal' },
      { name: '出水 pH', current: '7.2', unit: '', setValue: '6.5~8.0', status: 'normal' },
    ],
    devices: [
      { id: 'P1', name: '消毒计量泵', mode: '自动', status: '运行', frequency: '40Hz', runHours: 3500, protection: '余氯PID' },
      { id: 'P2', name: '备用消毒泵', mode: '自动', status: '停止', runHours: 0, protection: '轮值' },
      { id: 'M1', name: '余氯监测仪', mode: '自动', status: '运行', runHours: 8760, protection: '数据校验' },
    ],
    interlocks: [
      { name: '余氯 PID 投加', condition: '目标 0.8 mg/L', satisfied: true },
      { name: '超高自动停泵', condition: '余氯 ≥ 2.0 停泵', satisfied: true },
      { name: '低液位报警', condition: '< 0.5m 提示补充', satisfied: true },
    ],
    trend: { title: '余氯 · 近24小时', unit: 'mg/L', data: baseTrend('c07', 0.8, 0.3), setValue: 0.8 },
  },

  c08: {
    code: 'c08',
    title: '污泥脱水',
    subtitle: '带式压滤机 · 7步全自动循环',
    params: [
      { name: '脱水机状态', current: '运行(步骤 2/7)', unit: '', status: 'normal' },
      { name: '处理量', current: '12', unit: 'm³/h', status: 'normal' },
      { name: '进泥浓度', current: '99.5', unit: '%', status: 'normal' },
      { name: 'PAM 加药量', current: '0.8', unit: 'L/h', status: 'normal' },
      { name: '滤带张力', current: '0.35', unit: 'MPa', status: 'normal' },
      { name: '泥饼含水率', current: '80', unit: '%', status: 'normal' },
    ],
    devices: [
      { id: 'D1', name: '1#脱水机', mode: '自动', status: '运行', runHours: 980, protection: '7步循环' },
      { id: 'P1', name: '污泥进料泵', mode: '自动', status: '运行', frequency: '32Hz', runHours: 980, protection: '联锁' },
      { id: 'P2', name: 'PAM 加药泵', mode: '自动', status: '运行', runHours: 980, protection: '联动' },
      { id: 'C1', name: '传送带', mode: '自动', status: '运行', runHours: 980, protection: '联锁' },
    ],
    interlocks: [
      { name: '7步循环', condition: '①进料 ②加药 ③混合 ④低压脱水 ⑤高压脱水 ⑥出料 ⑦冲洗', satisfied: true },
      { name: '进泥停止', condition: '泥饼含水率 > 85%', satisfied: true },
      { name: 'PAM 低液位', condition: '< 0.5m 告警', satisfied: true },
    ],
    trend: { title: '处理量 · 近24小时', unit: 'm³/h', data: baseTrend('c08', 12, 3) },
  },

  c09: {
    code: 'c09',
    title: '白塔污泥处理车间',
    subtitle: '压滤7步循环 + 50吨汽车衡',
    params: [
      { name: '压滤机状态', current: '步骤 2/7', unit: '', status: 'normal' },
      { name: '当前称重', current: '2.1', unit: '吨', status: 'normal' },
      { name: '今日累计称重', current: '48', unit: '吨', status: 'normal' },
      { name: '车间温度', current: '26', unit: '℃', status: 'normal' },
      { name: '车间湿度', current: '65', unit: '%RH', status: 'normal' },
      { name: 'PAM 药箱液位', current: '1.5', unit: 'm', status: 'normal' },
    ],
    devices: [
      { id: 'F1', name: '1#压滤机', mode: '自动', status: '运行', runHours: 1250, protection: '7步循环' },
      { id: 'P1', name: '污泥进料泵', mode: '自动', status: '运行', frequency: '30Hz', runHours: 1250, protection: '联锁' },
      { id: 'PAM', name: 'PAM 加药泵', mode: '自动', status: '运行', runHours: 1250, protection: '液位' },
      { id: 'S1', name: '汽车衡', mode: '手动', status: '就绪', runHours: 0, protection: '称重就绪' },
      { id: 'G1', name: '输送机', mode: '自动', status: '运行', runHours: 1250, protection: '联锁' },
    ],
    interlocks: [
      { name: '压滤循环', condition: '①进料 ②压榨 ③泄压 ④松开 ⑤拉板 ⑥卸料 ⑦冲洗', satisfied: true },
      { name: '压力联锁', condition: '压榨压力 ≥ 0.6 MPa', satisfied: true },
      { name: '汽车衡通讯', condition: '就绪', satisfied: true },
    ],
    trend: { title: '今日累计称重 · 实时', unit: '吨', data: baseTrend('c09', 48, 8) },
  },

  c10: {
    code: 'c10',
    title: '水东一体化泵站远程监控',
    subtitle: '3座无人值守泵站 · 远程控制',
    params: [
      { name: '1#泵站液位', current: '2.8', unit: 'm', status: 'normal' },
      { name: '1#泵站流量', current: '250', unit: 'm³/h', status: 'normal' },
      { name: '2#泵站液位', current: '2.2', unit: 'm', status: 'normal' },
      { name: '2#泵站流量', current: '125', unit: 'm³/h', status: 'normal' },
      { name: '3#泵站液位', current: '1.5', unit: 'm', status: 'normal' },
      { name: '3#泵站流量', current: '21', unit: 'm³/h', status: 'normal' },
      { name: '干线压力 P1', current: '0.35', unit: 'MPa', status: 'normal' },
      { name: '干线压力 P2', current: '0.28', unit: 'MPa', status: 'normal' },
    ],
    devices: [
      { id: '1#P1', name: '1#泵站 1#泵', mode: '自动', status: '运行', frequency: '42Hz', runHours: 1650, protection: '液位联锁' },
      { id: '1#P2', name: '1#泵站 2#泵', mode: '自动', status: '停止', runHours: 0, protection: '备用' },
      { id: '2#P1', name: '2#泵站 1#泵', mode: '自动', status: '运行', frequency: '40Hz', runHours: 1620, protection: '液位联锁' },
      { id: '2#P2', name: '2#泵站 2#泵', mode: '自动', status: '停止', runHours: 0, protection: '备用' },
      { id: '3#P1', name: '3#泵站 1#泵', mode: '自动', status: '运行', frequency: '35Hz', runHours: 1580, protection: '液位联锁' },
    ],
    interlocks: [
      { name: '高液位自动启泵', condition: '液位 ≥ 2.5m 启1#, ≥ 3.0m 启2#', satisfied: true },
      { name: '低液位停泵', condition: '液位 < 1.0m 全部停', satisfied: true },
      { name: '远程控制权', condition: '远程（非就地）', satisfied: true },
      { name: '通讯状态', condition: '3座泵站全部在线', satisfied: true },
    ],
    trend: { title: '1#泵站液位 · 近24小时', unit: 'm', data: baseTrend('c10', 2.8, 0.8), setValue: 2.8 },
  },
};
