import { useParams } from 'react-router-dom';
import { ProcessDiagramPage } from '@/pages/B/ProcessDiagramPage';
import { OperationPanelTemplate } from '@/components/hmi/OperationPanelTemplate';
import { cPanelData } from '@/data/cPanelData';
import { AlarmDetailPage } from '@/pages/D/AlarmDetailPage';
import { AnalysisPage } from '@/pages/D/AnalysisPage';
import { BusinessListPage, type ListPageConfig } from '@/pages/E/BusinessListPage';
import { BusinessDetailPage, type DetailConfig } from '@/pages/E/BusinessDetailPage';
import { useState } from 'react';

// ===== E 系列差异化数据 =====
type SiteRow = { id: string; name: string; code: string; capacity: string; flow: string; status: string; manager: string; location: string };
const siteData: SiteRow[] = [
  { id: 'S01', name: '建春污水处理厂一期', code: 'B02', capacity: '2.0万 m³/d', flow: '620 m³/h', status: '正常', manager: '李工', location: '蓉江新区' },
  { id: 'S02', name: '金风梅园污水处理厂', code: 'B03', capacity: '3.0万 m³/d', flow: '860 m³/h', status: '正常', manager: '孙工', location: '赣县区' },
  { id: 'S03', name: '沙石污水处理厂', code: 'B04', capacity: '2.0万 m³/d', flow: '580 m³/h', status: '报警', manager: '周工', location: '章贡区' },
  { id: 'S04', name: '蓉江新区污水处理厂二期', code: 'B05', capacity: '4.0万 m³/d', flow: '1240 m³/h', status: '正常', manager: '张工', location: '蓉江新区' },
  { id: 'S05', name: '水东再生水厂', code: 'B06', capacity: '2.5万 m³/d', flow: '680 m³/h', status: '正常', manager: '孙工', location: '赣县区' },
  { id: 'S06', name: '白塔污泥处理处置中心', code: 'B07', capacity: '100 吨/d', flow: '100 吨/d', status: '正常', manager: '李工', location: '章贡区' },
];

type DeviceRow = { id: string; name: string; type: string; site: string; status: string; runHours: number; nextMaintain: string };
const deviceData: DeviceRow[] = [
  { id: 'P-001', name: '1#提升泵', type: '离心泵', site: '蓉江新区', status: '运行', runHours: 1860, nextMaintain: '2026-09-20' },
  { id: 'P-002', name: '2#提升泵', type: '离心泵', site: '蓉江新区', status: '运行', runHours: 1842, nextMaintain: '2026-09-20' },
  { id: 'B-001', name: '1#鼓风机', type: '罗茨风机', site: '蓉江新区', status: '运行', runHours: 2150, nextMaintain: '2026-10-15' },
  { id: 'B-002', name: '2#鼓风机', type: '罗茨风机', site: '蓉江新区', status: '故障', runHours: 2100, nextMaintain: '2026-08-20' },
  { id: 'D-001', name: '1#带式脱水机', type: '带式', site: '白塔污泥处置', status: '运行', runHours: 980, nextMaintain: '2026-11-05' },
  { id: 'G-001', name: '粗格栅', type: '回转式', site: '沙石厂', status: '运行', runHours: 3520, nextMaintain: '2026-09-30' },
  { id: 'F-001', name: '1#搅拌机', type: '潜水式', site: '蓉江新区', status: '正常', runHours: 8760, nextMaintain: '2027-03-01' },
];

type VideoRow = { id: string; name: string; site: string; location: string; status: string; resolution: string };
const videoData: VideoRow[] = [
  { id: 'V001', name: '进水泵站前院', site: '蓉江新区', location: '北门', status: '在线', resolution: '1920×1080' },
  { id: 'V002', name: '生化池1#区全景', site: '蓉江新区', location: '生化池', status: '在线', resolution: '2560×1440' },
  { id: 'V003', name: '出水监测间', site: '蓉江新区', location: '出水区', status: '在线', resolution: '1920×1080' },
  { id: 'V004', name: '污泥脱水车间', site: '白塔污泥处置', location: '脱水间', status: '离线', resolution: '1920×1080' },
];

type MonitorRow = { id: string; name: string; type: string; site: string; value: string; unit: string; status: string };
const monitorData: MonitorRow[] = [
  { id: 'M001', name: 'DO_1_AO2', type: '在线溶解氧', site: '蓉江新区', value: '2.0', unit: 'mg/L', status: '正常' },
  { id: 'M002', name: 'MLSS_1', type: '污泥浓度', site: '蓉江新区', value: '3150', unit: 'mg/L', status: '正常' },
  { id: 'M003', name: 'ORP_缺氧区', type: '氧化还原电位', site: '蓉江新区', value: '-235', unit: 'mV', status: '正常' },
  { id: 'M004', name: 'COD_出水', type: 'COD分析仪', site: '蓉江新区', value: '25', unit: 'mg/L', status: '正常' },
  { id: 'M005', name: '氨氮_出水', type: '氨氮分析仪', site: '蓉江新区', value: '0.8', unit: 'mg/L', status: '正常' },
  { id: 'M006', name: '余氯_出水', type: '余氯分析仪', site: '沙石厂', value: '1.2', unit: 'mg/L', status: '正常' },
  { id: 'M007', name: 'pH_出水', type: 'pH计', site: '蓉江新区', value: '7.2', unit: '', status: '正常' },
];

// ===== 路由分发器 =====
export function SmartPageDispatcher() {
  const { code = '' } = useParams();
  const lower = code.toLowerCase();
  const numPart = parseInt(lower.replace(/[^\d]/g, ''), 10);

  // B 系列 - 工艺流程画面（通用 ProcessDiagramPage 根据 code 自动取站点）
  if (lower.startsWith('b')) {
    return <ProcessDiagramPage />;
  }

  // C 系列 - 工艺单元操作面板
  if (lower.startsWith('c')) {
    const panel = cPanelData[lower];
    if (panel) return <OperationPanelTemplate data={panel} />;
    return <OperationPanelTemplate data={cPanelData.c01} />;
  }

  // D 系列
  if (lower.startsWith('d')) {
    if (lower === 'd01' || lower === 'd02') {
      return <AlarmDetailPage />;
    }
    if (numPart >= 5 && numPart <= 9) {
      return <AnalysisPage code={lower} />;
    }
  }

  // E 系列 - 业务实体
  if (lower.startsWith('e')) {
    const type = lower[1]; // e01/e02 -> type '0' or '1'
    const isDetail = numPart % 2 === 0;
    const listTypes: Record<string, { num: string; name: string; data: any[]; codeList: string; codeDetail: string; subtitle: string; searchFields: string[]; columns: any[]; newItem: string }> = {
      '0': { num: '01', name: '站点管理', data: siteData, codeList: 'E01', codeDetail: 'E02', subtitle: '6个子项全景', searchFields: ['name', 'code', 'location'], newItem: '新增站点',
        columns: [
          { key: 'code', label: '编号' },
          { key: 'name', label: '站点名称' },
          { key: 'capacity', label: '处理规模' },
          { key: 'flow', label: '当前流量' },
          { key: 'status', label: '状态', render: (r: SiteRow) => (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
          )},
          { key: 'manager', label: '负责人' },
          { key: 'location', label: '所属区域' },
        ] },
      '3': { num: '03', name: '告警管理', data: [], codeList: 'E03', codeDetail: 'E04', subtitle: '业务告警检索', searchFields: ['name'], newItem: '新增告警规则', columns: [{ key: 'name', label: '名称' }] },
      '5': { num: '05', name: '设备管理', data: deviceData, codeList: 'E05', codeDetail: 'E06', subtitle: '设备台账检索', searchFields: ['name', 'id', 'site'], newItem: '登记新设备',
        columns: [
          { key: 'id', label: '设备编号' },
          { key: 'name', label: '设备名称' },
          { key: 'type', label: '类型' },
          { key: 'site', label: '所属子项' },
          { key: 'status', label: '状态', render: (r: DeviceRow) => (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.status === '运行' ? 'bg-green-100 text-green-700' : r.status === '故障' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
          )},
          { key: 'runHours', label: '累计运行(h)', render: (r: DeviceRow) => <span className="font-mono">{r.runHours}</span> },
          { key: 'nextMaintain', label: '下次维护' },
        ] },
      '7': { num: '07', name: '模板管理', data: [], codeList: 'E07', codeDetail: 'E08', subtitle: '报表/报警模板检索', searchFields: ['name'], newItem: '新建模板', columns: [{ key: 'name', label: '模板名称' }] },
      '9': { num: '09', name: '视频监控', data: videoData, codeList: 'E09', codeDetail: 'E10', subtitle: '视频点位检索', searchFields: ['name', 'location', 'site'], newItem: '新增监控点',
        columns: [
          { key: 'id', label: '编号' },
          { key: 'name', label: '点位名称' },
          { key: 'site', label: '所属子项' },
          { key: 'location', label: '安装位置' },
          { key: 'status', label: '状态', render: (r: VideoRow) => (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.status === '在线' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
          )},
          { key: 'resolution', label: '分辨率' },
        ] },
      '1': { num: '11', name: '监测点管理', data: monitorData, codeList: 'E11', codeDetail: 'E12', subtitle: '监测点/传感器台账', searchFields: ['name', 'type', 'site'], newItem: '新增监测点',
        columns: [
          { key: 'id', label: '编号' },
          { key: 'name', label: '点位名称' },
          { key: 'type', label: '监测类型' },
          { key: 'site', label: '所属子项' },
          { key: 'value', label: '当前值', render: (r: MonitorRow) => <span className="font-mono font-bold">{r.value}</span> },
          { key: 'unit', label: '单位' },
          { key: 'status', label: '状态', render: (r: MonitorRow) => (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
          )},
        ] },
    };

    // type 映射（e01->'0', e03->'3', e05->'5', e07->'7', e09->'9', e11->'1'）
    let typeKey = '';
    if (numPart === 1 || numPart === 2) typeKey = '0';
    else if (numPart === 3 || numPart === 4) typeKey = '3';
    else if (numPart === 5 || numPart === 6) typeKey = '5';
    else if (numPart === 7 || numPart === 8) typeKey = '7';
    else if (numPart === 9 || numPart === 10) typeKey = '9';
    else if (numPart === 11 || numPart === 12) typeKey = '1';

    const cfg = listTypes[typeKey] || listTypes['0'];
    if (isDetail) {
      // 详情页
      const item = cfg.data[0];
      return <EDetailWrapper code={cfg.codeDetail} name={cfg.name} item={item} listCfg={cfg} />;
    } else {
      const listConfig: ListPageConfig<any> = {
        title: cfg.name,
        code: cfg.codeList,
        subtitle: cfg.subtitle,
        newItemLabel: cfg.newItem,
        columns: cfg.columns,
        data: cfg.data,
        searchFields: cfg.searchFields,
      };
      return <BusinessListPage config={listConfig} />;
    }
  }

  // 未知 code 回退
  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-500">
      <div className="text-3xl mb-2">🔍</div>
      <div className="text-sm">未知页面：{code.toUpperCase()}</div>
      <div className="text-[11px] text-gray-400 mt-1">请检查规格文档中的页面编码</div>
    </div>
  );
}

function EDetailWrapper({ code, name, item, listCfg }: any) {
  const detailConfig: DetailConfig = {
    code,
    title: name,
    subtitle: item ? `${item.name} · ${item.id}` : '详情页面',
    sections: [
      { title: '基本信息', items: [
        { label: '编号', value: item?.id || '—' },
        { label: '名称', value: item?.name || '—' },
        { label: '状态', value: <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold">正常</span> },
        { label: '所属子项', value: item?.site || item?.location || '—' },
        { label: '创建时间', value: '2026-01-15' },
        { label: '最后更新', value: '2026-08-15 14:30:00' },
      ]},
      { title: '规格参数', items: [
        { label: '类型/型号', value: item?.type || '—' },
        { label: '生产厂商', value: '供应商 A' },
        { label: '安装位置', value: item?.location || '—' },
        { label: '累计运行', value: <span className="font-mono">{item?.runHours || '—'} h</span> },
        { label: '下次维护', value: item?.nextMaintain || '—' },
        { label: '保修状态', value: '在保' },
      ]},
    ],
    related: {
      label: '关联对象',
      items: [
        { name: `${listCfg.name}-相关1`, status: '正常' },
        { name: `${listCfg.name}-相关2`, status: '正常' },
        { name: `${listCfg.name}-相关3`, status: '故障' },
      ],
    },
    tabs: [
      { key: 'history', name: '变更历史' },
      { key: 'alarm', name: '关联报警' },
      { key: 'doc', name: '技术文档' },
    ],
  };
  return <BusinessDetailPage config={detailConfig} />;
}
