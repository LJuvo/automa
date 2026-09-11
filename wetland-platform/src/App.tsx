import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/A/LoginPage';
import { WorkbenchPage } from '@/pages/A/WorkbenchPage';
import { PlatformLayout } from '@/components/layout/PlatformLayout';
import { OverviewPage } from '@/pages/B/OverviewPage';
import { ProcessDiagramPage } from '@/pages/B/ProcessDiagramPage';
import { OperationPanelPage } from '@/pages/C/OperationPanelPage';
import { AlarmManagementPage } from '@/pages/D/AlarmManagementPage';
import { TrendAnalysisPage } from '@/pages/D/TrendAnalysisPage';
import { ReportManagementPage } from '@/pages/D/ReportManagementPage';
import { UserManagementPage } from '@/pages/A/UserManagementPage';
import { RolePermissionPage } from '@/pages/A/RolePermissionPage';
import { SystemConfigPage } from '@/pages/A/SystemConfigPage';
import { GenericPage } from '@/pages/GenericPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页 - 独立布局 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 主框架下的页面 */}
        <Route element={<PlatformLayout />}>
          <Route path="/" element={<Navigate to="/workbench" replace />} />
          <Route path="/workbench" element={<WorkbenchPage />} />

          {/* B 系列 - 全厂总览 */}
          <Route path="/overview" element={<OverviewPage />} />

          {/* 核心工艺画面 B02 */}
          <Route path="/page/b02" element={<ProcessDiagramPage />} />

          {/* C 系列 - 核心操作面板 C01 */}
          <Route path="/page/c01" element={<OperationPanelPage />} />

          {/* D 系列 */}
          <Route path="/alarm" element={<AlarmManagementPage />} />
          <Route path="/trend" element={<TrendAnalysisPage />} />
          <Route path="/report" element={<ReportManagementPage />} />

          {/* A 系列 - 系统管理 */}
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/roles" element={<RolePermissionPage />} />
          <Route path="/config" element={<SystemConfigPage />} />
          <Route path="/logs" element={<div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">操作日志页面（A07）— 按通用列表页结构实现</div>} />

          {/* 所有其他子页面通过 GenericPage 统一映射 */}
          <Route path="/page/:code" element={<GenericPage />} />

          {/* 重定向 */}
          <Route path="*" element={<Navigate to="/workbench" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
