import React from 'react';
import { useClass } from '../context/ClassContext';
import { Users, UserCheck, Award, Heart, Activity, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { students, behaviorLogs, attendanceLogs } = useClass();

  // คำนวณข้อมูลสถิติพื้นฐาน
  const totalStudents = students.length;
  const maleCount = students.filter(s => s.gender === 'male').length;
  const femaleCount = students.filter(s => s.gender === 'female').length;
  
  const malePercentage = totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 0;
  const femalePercentage = totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0;

  // คะแนนพฤติกรรมเฉลี่ย
  const averagePoints = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.points, 0) / totalStudents)
    : 100;

  // รายการเช็คชื่อล่าสุด (วันนี้หรือล่าสุดที่มีการเช็คชื่อ)
  const getLatestAttendance = () => {
    if (attendanceLogs.length === 0) return null;
    // เรียงวันที่จากล่าสุด
    const sortedLogs = [...attendanceLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sortedLogs[0];
  };

  const latestAttendance = getLatestAttendance();
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let sickCount = 0;
  let leaveCount = 0;

  if (latestAttendance) {
    const records = Object.values(latestAttendance.records);
    records.forEach(status => {
      if (status === 'present') presentCount++;
      if (status === 'absent') absentCount++;
      if (status === 'late') lateCount++;
      if (status === 'sick') sickCount++;
      if (status === 'leave') leaveCount++;
    });
  }

  // อัตราการมาเรียนในรอบล่าสุด
  const attendanceRate = latestAttendance && totalStudents > 0
    ? Math.round(((presentCount + lateCount) / totalStudents) * 100)
    : 0;

  // นร. ดีเด่น (Top 5 คะแนนพฤติกรรม)
  const topStudents = [...students]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  // ดึงรายการประวัติความประพฤติล่าสุด 5 รายการ
  const recentLogs = behaviorLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Stats Summary Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white">ระบบจัดการชั้นเรียนมัธยม</h2>
        <p className="text-sm text-gray-400">ภาพรวมข้อมูลในห้องเรียน ความประพฤติ และสถิติการเข้าเรียนในวันนี้</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: นักเรียนทั้งหมด */}
        <div className="p-5 rounded-2xl glass-panel glow-purple relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-violet-600/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase">นักเรียนทั้งหมด</span>
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalStudents}</span>
            <span className="text-sm text-gray-400">คน</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>ชาย {maleCount} คน</span>
            <span>หญิง {femaleCount} คน</span>
          </div>
        </div>

        {/* Card 2: อัตราการมาเรียนล่าสุด */}
        <div className="p-5 rounded-2xl glass-panel glow-blue relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase">การเข้าเรียนล่าสุด ({latestAttendance?.date || 'ไม่มีข้อมูล'})</span>
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{attendanceRate}%</span>
            <span className="text-sm text-gray-400">เข้าเรียน</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>มาสาย {lateCount} คน</span>
            <span>ขาด {absentCount} คน</span>
          </div>
        </div>

        {/* Card 3: คะแนนความประพฤติเฉลี่ย */}
        <div className="p-5 rounded-2xl glass-panel glow-pink relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-pink-600/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase">คะแนนเฉลี่ย</span>
            <div className="p-2 rounded-xl bg-pink-600/20 text-pink-400">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{averagePoints}</span>
            <span className="text-sm text-gray-400">แต้ม / คน</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><TrendingUp size={12} className="text-emerald-400" /> จากคะแนนตั้งต้น 100</span>
          </div>
        </div>

        {/* Card 4: สุขภาพ/กรุ๊ปเลือดเด่น */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-600/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase">กรุ๊ปเลือดที่มีมากที่สุด</span>
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400">
              <Heart size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {students.length > 0 ? (
                // คำนวณหาหมู่เลือดที่มีเยอะสุด
                Object.entries(students.reduce((acc, curr) => {
                  acc[curr.bloodType] = (acc[curr.bloodType] || 0) + 1;
                  return acc;
                }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'O'
              ) : 'O'}
            </span>
            <span className="text-sm text-gray-400">กรุ๊ปเด่น</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>A: {students.filter(s => s.bloodType === 'A').length} | B: {students.filter(s => s.bloodType === 'B').length} | O: {students.filter(s => s.bloodType === 'O').length} | AB: {students.filter(s => s.bloodType === 'AB').length}</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns - Gender Ratio & Merit Board */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gender Ratio Card */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-blue-400" />
              สัดส่วนเพศและสถิติ
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-gray-400">
              <span>ชาย {malePercentage}%</span>
              <span>หญิง {femalePercentage}%</span>
            </div>
            {/* Visual ratio bar */}
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden flex">
              <div style={{ width: `${malePercentage}%` }} className="h-full bg-blue-500 transition-all duration-500" />
              <div style={{ width: `${femalePercentage}%` }} className="h-full bg-pink-500 transition-all duration-500" />
            </div>
          </div>

          {/* Detailed Attendance breakdown */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">สรุปสถานะการเข้าเรียนล่าสุด</h4>
            {latestAttendance ? (
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">
                  <span className="block font-bold text-lg">{presentCount}</span>
                  <span className="text-[10px] text-emerald-500/80">มาเรียน</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400">
                  <span className="block font-bold text-lg">{lateCount}</span>
                  <span className="text-[10px] text-blue-500/80">สาย</span>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/15 text-orange-400">
                  <span className="block font-bold text-lg">{leaveCount}</span>
                  <span className="text-[10px] text-orange-500/80">ลากิจ</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-400">
                  <span className="block font-bold text-lg">{sickCount}</span>
                  <span className="text-[10px] text-amber-500/80">ลาป่วย</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/15 text-rose-400">
                  <span className="block font-bold text-lg">{absentCount}</span>
                  <span className="text-[10px] text-rose-500/80">ขาด</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-gray-500 bg-white/5 rounded-xl">
                ไม่มีประวัติการเช็คชื่อเข้าเรียน
              </div>
            )}
          </div>
        </div>

        {/* Top Merit Board */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Award size={18} className="text-yellow-400" />
            นักเรียนดีเด่น (คะแนนความประพฤติสูงสุด)
          </h3>
          
          <div className="space-y-3">
            {topStudents.map((student, idx) => {
              const medals = ['🥇', '🥈', '🥉', '✨', '✨'];
              return (
                <div key={student.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{medals[idx]}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{student.name} ({student.nickname})</h4>
                      <p className="text-[10px] text-gray-400">รหัส {student.studentId} • {student.role}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-lg">
                    {student.points} แต้ม
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section: Recent Behavior Activity */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <AlertCircle size={18} className="text-violet-400" />
            ประวัติพฤติกรรมล่าสุด
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-400 uppercase">
                <th className="py-2.5 px-3">วัน-เวลา</th>
                <th className="py-2.5 px-3">นักเรียน</th>
                <th className="py-2.5 px-3">ความประพฤติ / เหตุผล</th>
                <th className="py-2.5 px-3 text-right">คะแนน</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-xs text-gray-500">
                    ไม่มีรายการบันทึกพฤติกรรมล่าสุด
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {log.studentName}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-300">
                      {log.reason}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-md ${
                        log.type === 'merit' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                      }`}>
                        {log.points > 0 ? `+${log.points}` : log.points}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
