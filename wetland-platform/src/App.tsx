import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/A/LoginPage';
import { WorkbenchPage } from '@/pages/A/WorkbenchPage';
import { PlatformLayout } from '@/components/layout/PlatformLayout';
import { OverviewPage } from '@/pages/B/OverviewPage';
import { AlarmManagementPage } from '@/pages/D/AlarmManagementPage';
import { TrendAnalysisPage } from '@/pages/D/TrendAnalysisPage';
import { ReportManagementPage } from '@/pages/D/ReportManagementPage';
import { UserManagementPage } from '@/pages/A/UserManagementPage';
import { RolePermissionPage } from '@/pages/A/RolePermissionPage';
import { SystemConfigPage } from '@/pages/A/SystemConfigPage';
import { UserProfilePage } from '@/pages/A/UserProfilePage';
import { OperationLogPage } from '@/pages/A/OperationLogPage';
import { DomainEntryPage } from '@/pages/DomainEntryPage';
import { SmartPageDispatcher } from '@/pages/SmartPageDispatcher';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PlatformLayout />}>
          <Route path="/" element={<Navigate to="/workbench" replace />} />
          <Route path="/workbench" element={<WorkbenchPage />} />

          {/* 1️⃣ 总览 */}
          <Route path="/overview" element={<OverviewPage />} />

          {/* 2️⃣ 生产工艺 — /page/b02~b07 + /page/c01~c08 走 SmartPageDispatcher */}

          {/* 3️⃣ 报警事件 */}
          <Route path="/alarm" element={<AlarmManagementPage />} />

          {/* 4️⃣ 数据分析 */}
          <Route path="/trend" element={<TrendAnalysisPage />} />
          <Route path="/report" element={<ReportManagementPage />} />

          {/* 5️⃣ 调度运行（新域）*/}
          <Route path="/schedule" element={
            <DomainEntryPage
              title="📋 调度运行中心"
              subtitle="值班排班 · 操作票 · 运行日志 · SOP"
              accent="oklch(55% 0.15 210)"
              items={[
                { path: "/page/e01",  name: "值班排班",   desc: "查看/调整 6 个厂 × 3 个班次的月度排班表 · 替代班次审批", count: 186 },
                { path: "/page/e05",  name: "操作票管理", desc: "操作票填写 → 签发 → 执行 → 监护 → 终结 全流程",       count: 42 },
                { path: "/logs",      name: "运行日志",   desc: "当班员每 4 小时填写的运行检查单，支持 AI 辅助",         count: 1240 },
                { path: "/report",    name: "SOP 作业指导", desc: "所有工艺单元/设备的标准操作规程电子版",               count: 58 },
              ]} />
          } />

          {/* 6️⃣ 设备运维（新域）*/}
          <Route path="/assets" element={
            <DomainEntryPage
              title="⚙️ 设备运维中心"
              subtitle="台账 · 预防性维护 · 工单 · 备件 · 巡检"
              accent="oklch(55% 0.17 40)"
              items={[
                { path: "/page/e05",  name: "设备台账",    desc: "1068 台设备的 KKS 编码 · 位置 · 规格 · 保修期 · 履历", count: 1068 },
                { path: "/page/e05",  name: "预防性维护",  desc: "按时间/运行时长触发的 PM 计划 · 自动生成工单",         count: 320 },
                { path: "/page/e05",  name: "工单管理",    desc: "故障 → 报修 → 派工 → 维修 → 验收 · 全闭环",            count: 96 },
                { path: "/page/e05",  name: "备件管理",    desc: "备件库 · 最低库存 · 采购申请 · 出入库",                count: 450 },
                { path: "/page/e09",  name: "巡检",        desc: "PDA 扫码点检 · 缺陷上报 · 自动生成工单",                count: 36 },
              ]} />
          } />

          {/* 7️⃣ 系统管理 */}
          <Route path="/users"  element={<UserManagementPage />} />
          <Route path="/roles"  element={<RolePermissionPage />} />
          <Route path="/config" element={<SystemConfigPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/logs"   element={<OperationLogPage />} />

          {/* /page/:code 智能分发 — B02~B07 / C01~C10 / D01~D09 / E01~E12 */}
          <Route path="/page/:code" element={<SmartPageDispatcher />} />

          <Route path="*" element={<Navigate to="/workbench" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
