import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const pageMap: Record<string, { title: string; desc: string; pageNumber: string }> = {
  'b02': { title: '建春湿地公园再生水站扩容', desc: '2.0万 m³/d · 结构同B02样板', pageNumber: 'B02' },
  'b03': { title: '金风梅园再生水处理厂', desc: '3.0万 m³/d', pageNumber: 'B03' },
  'b04': { title: '沙石污水处理厂一期', desc: '2.0万 m³/d（远期3万）', pageNumber: 'B04' },
  'b05': { title: '蓉江新区再生水厂一期', desc: '4.0万 m³/d（远期16万）· 最大子项', pageNumber: 'B05' },
  'b06': { title: '水东水质净化厂', desc: '2.5万 m³/d（远期5万）· 含3座泵站', pageNumber: 'B06' },
  'b07': { title: '白塔污泥处理处置二期', desc: '土建200/设备100吨/d', pageNumber: 'B07' },
  'c01': { title: '进水泵站及格栅', desc: 'HMI 第3级 · 工艺单元操作面板', pageNumber: 'C01' },
  'c02': { title: '沉砂池', desc: '排砂与曝气控制', pageNumber: 'C02' },
  'c03': { title: '生化池(A²/O)', desc: '核心页面 · DO-PID与回流控制', pageNumber: 'C03' },
  'c04': { title: '鼓风曝气群控', desc: '4台鼓风机群控策略', pageNumber: 'C04' },
  'c05': { title: '二沉池及回流', desc: '回流比与排泥控制', pageNumber: 'C05' },
  'c06': { title: '加药系统', desc: 'PAC与碳源投加', pageNumber: 'C06' },
  'c07': { title: '消毒系统', desc: '比例投加+余氯反馈', pageNumber: 'C07' },
  'c08': { title: '污泥脱水', desc: '7步全自动循环', pageNumber: 'C08' },
  'c09': { title: '白塔污泥处理车间', desc: '压滤7步循环+汽车衡', pageNumber: 'C09' },
  'c10': { title: '水东一体化泵站远程监控', desc: '3座泵站无人值守', pageNumber: 'C10' },
  'e01': { title: '站点管理', desc: '业务实体管理 · 列表页', pageNumber: 'E01' },
  'e02': { title: '站点详情', desc: '单站点全景档案', pageNumber: 'E02' },
  'e03': { title: '告警管理', desc: '业务告警检索', pageNumber: 'E03' },
  'e04': { title: '告警详情', desc: '业务告警处置', pageNumber: 'E04' },
  'e05': { title: '设备管理', desc: '设备台账检索', pageNumber: 'E05' },
  'e06': { title: '设备详情', desc: '单设备档案与履历', pageNumber: 'E06' },
  'e07': { title: '模板管理', desc: '模板检索', pageNumber: 'E07' },
  'e08': { title: '模板详情', desc: '模板字段配置', pageNumber: 'E08' },
  'e09': { title: '视频监控', desc: '视频点位检索', pageNumber: 'E09' },
  'e10': { title: '视频详情', desc: '实时预览与回放', pageNumber: 'E10' },
  'e11': { title: '监测点管理', desc: '监测点检索', pageNumber: 'E11' },
  'e12': { title: '监测点详情', desc: '点位数据与阈值', pageNumber: 'E12' },
};

export function GenericPage() {
  const { code = '' } = useParams();
  const info = pageMap[code.toLowerCase()] || { title: '页面待完善', desc: '规格文档中定义的页面', pageNumber: code.toUpperCase() };

  const isProcess = code.toLowerCase().startsWith('b');
  const isControl = code.toLowerCase().startsWith('c');

  // 核心页面直接渲染对应组件
  if (isProcess && (code === 'b02' || code === 'b03' || code === 'b04' || code === 'b05' || code === 'b06' || code === 'b07')) {
    // 动态导入 ProcessDiagramPage - 但这会导致循环，所以用简单的方式
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">{isProcess ? '🏭' : isControl ? '⚙️' : '📋'}</div>
          <div className="text-[11px] text-gray-400 font-mono mb-1">{info.pageNumber}</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{info.title}</h2>
          <p className="text-sm text-gray-500 mb-4">{info.desc}</p>

          <div className="bg-gray-50 rounded-lg p-4 text-[11px] text-gray-600 text-left mb-6">
            <div className="font-semibold text-gray-700 mb-1">📐 规格文档说明：</div>
            <ul className="list-disc pl-4 space-y-0.5">
              {isProcess && <li>结构同 B02 工艺流程样板页面</li>}
              {isControl && <li>结构同 C01 操作面板样板（五区布局）</li>}
              {!isProcess && !isControl && <li>结构同 E01 列表页 / E02 详情页通用结构</li>}
              <li>完整页面规格详见原型制作规格说明书</li>
              <li>包含元素级字段定义、示例数据与交互流程</li>
            </ul>
          </div>

          <div className="flex gap-2 justify-center">
            <Link to="/" className="px-4 py-2 text-xs rounded border border-gray-200 hover:bg-gray-50 flex items-center gap-1">
              <ArrowLeft size={12} /> 返回总览
            </Link>
            {isProcess && (
              <Link to="/page/c01" className="px-4 py-2 text-xs rounded bg-pri text-white hover:bg-pri-d">
                查看 C01 操作面板样板
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
