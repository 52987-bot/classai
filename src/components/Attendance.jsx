import React, { useState, useEffect } from 'react';
import { useClass } from '../context/ClassContext';
import { Calendar, Save, CheckCircle, Clock, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export default function Attendance() {
  const { students, attendanceLogs, saveAttendance } = useClass();
  const [selectedDate, setSelectedDate] = useState(() => {
    // กำหนดวันที่เริ่มต้นเป็น วันนี้ (YYYY-MM-DD)
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    return localToday.toISOString().split('T')[0];
  });

  const [records, setRecords] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // โหลดบันทึกการเช็คชื่อเมื่อเปลี่ยนวันที่
  useEffect(() => {
    const existingLog = attendanceLogs.find(log => log.date === selectedDate);
    if (existingLog) {
      setRecords(existingLog.records);
    } else {
      // ตั้งค่าเริ่มต้นให้นักเรียนทุกคนเป็น "present" (มาเรียน)
      const defaultRecords = {};
      students.forEach(s => {
        defaultRecords[s.id] = 'present';
      });
      setRecords(defaultRecords);
    }
  }, [selectedDate, attendanceLogs, students]);

  const handleStatusChange = (studentId, status) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSelectAllPresent = () => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = 'present';
    });
    setRecords(updated);
  };

  const handleSave = () => {
    saveAttendance(selectedDate, records);
    setSuccessMsg('บันทึกข้อมูลการเข้าเรียนเรียบร้อยแล้ว!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ดึงรายละเอียดสถิติสำหรับวันที่เลือก
  const getSelectedStats = () => {
    let present = 0, absent = 0, late = 0, sick = 0, leave = 0;
    Object.values(records).forEach(status => {
      if (status === 'present') present++;
      if (status === 'absent') absent++;
      if (status === 'late') late++;
      if (status === 'sick') sick++;
      if (status === 'leave') leave++;
    });
    return { present, absent, late, sick, leave };
  };

  const stats = getSelectedStats();

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">เช็คชื่อเข้าเรียนประจำวัน</h2>
          <p className="text-sm text-gray-400">บันทึกสถิติการเข้าเรียน สาย ขาด หรือลาของนักเรียน</p>
        </div>
        
        {/* Date Selector */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs text-gray-400 font-medium uppercase shrink-0">เลือกวันที่:</label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 text-sm rounded-xl glass-input pl-10 cursor-pointer"
            />
            <Calendar className="absolute left-3.5 top-2.5 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 p-4 rounded-2xl glass-panel text-center">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
          <span className="block text-xs text-gray-400">มาเรียน</span>
          <span className="text-xl font-bold">{stats.present}</span>
        </div>
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
          <span className="block text-xs text-gray-400">สาย</span>
          <span className="text-xl font-bold">{stats.late}</span>
        </div>
        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
          <span className="block text-xs text-gray-400">ลากิจ</span>
          <span className="text-xl font-bold">{stats.leave}</span>
        </div>
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
          <span className="block text-xs text-gray-400">ลาป่วย</span>
          <span className="text-xl font-bold">{stats.sick}</span>
        </div>
        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
          <span className="block text-xs text-gray-400">ขาดเรียน</span>
          <span className="text-xl font-bold">{stats.absent}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-panel-light">
        <button
          onClick={handleSelectAllPresent}
          className="px-4 py-2 text-xs font-semibold text-violet-400 hover:text-white border border-violet-500/30 hover:bg-violet-600/20 rounded-xl transition-all cursor-pointer"
        >
          ✅ มาเรียนทั้งหมด
        </button>

        <div className="flex items-center gap-3">
          {successMsg && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-pulse">
              {successMsg}
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all cursor-pointer"
          >
            <Save size={16} />
            บันทึกการเช็คชื่อ
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="rounded-2xl glass-panel overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs text-gray-400 uppercase bg-white/5">
              <th className="py-3 px-4">เลขที่ / รหัส</th>
              <th className="py-3 px-4">ชื่อ - นามสกุล</th>
              <th className="py-3 px-4 text-center">สถานะการเข้าเรียน</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-500 text-xs">
                  ยังไม่มีข้อมูลนักเรียนในระบบ กรุณาเพิ่มรายชื่อนักเรียนก่อนเช็คชื่อ
                </td>
              </tr>
            ) : (
              students.map((student, index) => {
                const currentStatus = records[student.id] || 'present';
                return (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs text-gray-400">
                      {(index + 1).toString().padStart(2, '0')} • {student.studentId}
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      {student.name} ({student.nickname})
                    </td>
                    <td className="py-4 px-4">
                      {/* Check buttons */}
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 max-w-sm mx-auto">
                        {/* Present */}
                        <button
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            currentStatus === 'present'
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                              : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          <CheckCircle size={12} />
                          <span className="hidden sm:inline">มาเรียน</span>
                        </button>

                        {/* Late */}
                        <button
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            currentStatus === 'late'
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                              : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          <Clock size={12} />
                          <span className="hidden sm:inline">สาย</span>
                        </button>

                        {/* Leave */}
                        <button
                          onClick={() => handleStatusChange(student.id, 'leave')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            currentStatus === 'leave'
                              ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                              : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          <HelpCircle size={12} />
                          <span className="hidden sm:inline">ลากิจ</span>
                        </button>

                        {/* Sick */}
                        <button
                          onClick={() => handleStatusChange(student.id, 'sick')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            currentStatus === 'sick'
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                              : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          <AlertTriangle size={12} />
                          <span className="hidden sm:inline">ลาป่วย</span>
                        </button>

                        {/* Absent */}
                        <button
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            currentStatus === 'absent'
                              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                              : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          <XCircle size={12} />
                          <span className="hidden sm:inline">ขาด</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* History Log Table */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <h3 className="font-bold text-white">ประวัติการเช็คชื่อเข้าเรียนที่บันทึกแล้ว</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {attendanceLogs.length === 0 ? (
            <p className="col-span-full text-center text-xs text-gray-500 py-4">ไม่มีประวัติการเช็คชื่อ</p>
          ) : (
            [...attendanceLogs]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(log => {
                const total = Object.keys(log.records).length;
                let present = 0;
                Object.values(log.records).forEach(status => {
                  if (status === 'present' || status === 'late') present++;
                });
                const rate = total > 0 ? Math.round((present / total) * 100) : 0;

                return (
                  <button
                    key={log.date}
                    onClick={() => setSelectedDate(log.date)}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 transition-all text-left flex flex-col justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-semibold text-white font-mono">{log.date}</span>
                      <span className={`text-xs px-2 py-0.5 font-bold rounded-lg ${
                        rate >= 90 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>{rate}% มาเรียน</span>
                    </div>
                    
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden flex">
                      {Object.values(log.records).map((st, i) => {
                        const colors = {
                          present: 'bg-emerald-500',
                          late: 'bg-blue-500',
                          leave: 'bg-orange-500',
                          sick: 'bg-amber-500',
                          absent: 'bg-rose-500'
                        };
                        return (
                          <div 
                            key={i} 
                            style={{ width: `${100 / total}%` }} 
                            className={`h-full ${colors[st] || 'bg-gray-500'}`} 
                          />
                        );
                      })}
                    </div>
                    
                    <span className="text-[10px] text-gray-400">คลิกเพื่อโหลดและแก้ไขรายละเอียดการเข้าเรียน</span>
                  </button>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
