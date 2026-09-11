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
import { SmartPageDispatcher } from '@/pages/SmartPageDispatcher';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PlatformLayout />}>
          <Route path="/" element={<Navigate to="/workbench" replace />} />
          <Route path="/workbench" element={<WorkbenchPage />} />

          {/* A 系列 - 系统管理 */}
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/roles" element={<RolePermissionPage />} />
          <Route path="/config" element={<SystemConfigPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/logs" element={<OperationLogPage />} />

          {/* B 系列 - 全厂总览 */}
          <Route path="/overview" element={<OverviewPage />} />

          {/* D 系列 - 独立入口 */}
          <Route path="/alarm" element={<AlarmManagementPage />} />
          <Route path="/trend" element={<TrendAnalysisPage />} />
          <Route path="/report" element={<ReportManagementPage />} />

          {/* 所有 /page/:code 子页面通过 SmartPageDispatcher 智能分发
              B02~B07 工艺流程画面 / C01~C10 操作面板 / D01~D09 报警与分析 / E01~E12 业务实体 */}
          <Route path="/page/:code" element={<SmartPageDispatcher />} />

          <Route path="*" element={<Navigate to="/workbench" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
