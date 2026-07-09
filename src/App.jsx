import React, { useState } from 'react';
import { ClassProvider } from './context/ClassContext';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import Attendance from './components/Attendance';
import BehaviorManager from './components/BehaviorManager';
import GroupGenerator from './components/GroupGenerator';
import SeatingChart from './components/SeatingChart';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Award, 
  Shuffle, 
  Grid, 
  GraduationCap 
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard, component: Dashboard },
    { id: 'students', label: 'รายชื่อนักเรียน', icon: Users, component: StudentList },
    { id: 'attendance', label: 'เช็คชื่อเข้าเรียน', icon: CheckSquare, component: Attendance },
    { id: 'behavior', label: 'คะแนนพฤติกรรม', icon: Award, component: BehaviorManager },
    { id: 'groups', label: 'สุ่มจัดกลุ่ม', icon: Shuffle, component: GroupGenerator },
    { id: 'seating', label: 'ผังที่นั่ง', icon: Grid, component: SeatingChart },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0b0f19]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/10">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                CleanClass
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Classroom Management Portal
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-gray-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>ภาคเรียนที่ 1 • มัธยมศึกษาปีที่ 6/1</span>
          </div>
        </div>
      </header>

      {/* Navigation Tab Bar */}
      <div className="w-full bg-[#0b0f19]/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto no-scrollbar py-2 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="animate-fade-in">
          <ActiveComponent />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 bg-[#0b0f19]/90 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 CleanClass Portal. พัฒนาขึ้นสำหรับคุณครูและนักเรียนชั้นมัธยมศึกษา</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ClassProvider>
      <AppContent />
    </ClassProvider>
  );
}
