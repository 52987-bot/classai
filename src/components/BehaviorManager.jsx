import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import { Award, AlertTriangle, ListFilter, Trash2, Calendar, FileText, CheckCircle } from 'lucide-react';

const PRESETS = [
  { label: '🌟 ช่วยเหลือครู / จัดกิจกรรมห้องเรียน', type: 'merit', points: 5, reason: 'ช่วยครูยกของและจัดกิจกรรมห้องเรียน' },
  { label: '🏆 ชนะการแข่งขัน / ทำชื่อเสียงให้ห้องเรียน', type: 'merit', points: 15, reason: 'ทำกิจกรรมสร้างชื่อเสียงให้โรงเรียน/ห้องเรียน' },
  { label: '📝 เข้าร่วมการตอบคำถามในห้องเรียนอย่างตั้งใจ', type: 'merit', points: 3, reason: 'มีส่วนร่วมในการตอบคำถามและทำกิจกรรมการเรียนการสอน' },
  { label: '🧹 ช่วยทำเวรประจำวันอย่างดีเยี่ยม', type: 'merit', points: 5, reason: 'ทำความสะอาดเวรประจำวันเสร็จเรียบร้อยและมีจิตสาธารณะ' },
  { label: '⏰ เข้าเรียนสาย / เช็คชื่อสาย', type: 'demerit', points: -5, reason: 'เข้าแถวหรือเข้าห้องเรียนช้ากว่ากำหนด' },
  { label: '❌ ไม่ส่งการบ้าน / ส่งงานช้ากว่ากำหนด', type: 'demerit', points: -10, reason: 'ไม่ส่งงานตามระยะเวลาที่กำหนด' },
  { label: '🔇 เล่นโทรศัพท์ / ส่งเสียงดังในห้องเรียน', type: 'demerit', points: -5, reason: 'เล่นอุปกรณ์สื่อสารหรือรบกวนสมาธิเพื่อนระหว่างเรียน' },
  { label: '👕 แต่งกายผิดระเบียบโรงเรียน', type: 'demerit', points: -5, reason: 'แต่งกายไม่ถูกระเบียบ ผิดวัน หรือสวมใส่เครื่องแบบไม่ครบ' }
];

export default function BehaviorManager() {
  const { students, behaviorLogs, adjustPoints } = useClass();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [customPoints, setCustomPoints] = useState(5);
  const [customReason, setCustomReason] = useState('');
  const [logFilter, setLogFilter] = useState('all');
  const [successMsg, setSuccessMsg] = useState('');

  const handleApplyPreset = (preset) => {
    if (!selectedStudent) {
      alert('กรุณาเลือกนักเรียนก่อนใส่คะแนนพฤติกรรม');
      return;
    }
    adjustPoints(selectedStudent, preset.points, preset.reason);
    triggerSuccess('บันทึกคะแนนเรียบร้อยแล้ว!');
  };

  const handleCustomSubmit = (e, type) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('กรุณาเลือกนักเรียนก่อนใส่คะแนนพฤติกรรม');
      return;
    }
    if (!customReason) {
      alert('กรุณากรอกเหตุผลสำหรับการปรับคะแนน');
      return;
    }

    const amt = type === 'merit' ? Math.abs(customPoints) : -Math.abs(customPoints);
    adjustPoints(selectedStudent, amt, customReason);
    setCustomReason('');
    triggerSuccess('บันทึกคะแนนพฤติกรรมเรียบร้อยแล้ว!');
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // กรอง Log
  const filteredLogs = behaviorLogs.filter(log => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Col 1 & 2: Controls & Presets */}
      <div className="space-y-6 lg:col-span-2">
        {/* Section 1: Selector & Custom Form */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="text-violet-400" size={20} />
            ระบบประเมินและปรับแต้มความประพฤติ
          </h3>
          
          <div className="space-y-4">
            {/* Student Picker */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase">เลือกนักเรียนที่ต้องการ:</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              >
                <option value="">-- เลือกนักเรียน --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#111928]">
                    {s.studentId} • {s.name} ({s.nickname}) - [ปัจจุบัน {s.points} แต้ม]
                  </option>
                ))}
              </select>
            </div>

            {/* Success banner */}
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium text-center animate-pulse">
                {successMsg}
              </div>
            )}

            {/* Custom Adjust Form */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
              {/* merit custom form */}
              <form onSubmit={(e) => handleCustomSubmit(e, 'merit')} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <CheckCircle size={16} />
                  <span>มอบคะแนนความดี (บวกแต้ม)</span>
                </div>
                
                <div>
                  <input
                    required
                    type="number"
                    min="1"
                    max="50"
                    placeholder="จำนวนแต้มที่จะบวก..."
                    value={customPoints}
                    onChange={(e) => setCustomPoints(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                  />
                </div>
                <div>
                  <input
                    required
                    type="text"
                    placeholder="เหตุผล (เช่น ตอบคำถามวิทย์ได้ถูกต้อง)..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  ➕ เพิ่มคะแนนความดี
                </button>
              </form>

              {/* demerit custom form */}
              <form onSubmit={(e) => handleCustomSubmit(e, 'demerit')} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                  <AlertTriangle size={16} />
                  <span>หักคะแนนพฤติกรรม (ลบแต้ม)</span>
                </div>
                
                <div>
                  <input
                    required
                    type="number"
                    min="1"
                    max="50"
                    placeholder="จำนวนแต้มที่จะหัก..."
                    value={customPoints}
                    onChange={(e) => setCustomPoints(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                  />
                </div>
                <div>
                  <input
                    required
                    type="text"
                    placeholder="เหตุผล (เช่น คุยเสียงดังระหว่างเรียน)..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg glass-input text-xs"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-rose-600/20 transition-all cursor-pointer"
                >
                  ➖ หักคะแนนพฤติกรรม
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Section 2: Preset Shortcuts */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div>
            <h3 className="font-bold text-white">ทางลัดพฤติกรรมยอดฮิต (Presets)</h3>
            <p className="text-xs text-gray-400">เลือกนักเรียนด้านบน จากนั้นคลิกปุ่มพฤติกรรมเพื่อปรับคะแนนทันที</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all hover:-translate-y-0.5 cursor-pointer ${
                  preset.type === 'merit'
                    ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10'
                    : 'bg-rose-500/5 border-rose-500/10 text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-white">{preset.type === 'merit' ? 'ความดี' : 'ทำโทษ'}</span>
                  <span>{preset.points > 0 ? `+${preset.points}` : preset.points} แต้ม</span>
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-1">{preset.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Col 3: Logs View */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col space-y-4">
        {/* Header Log and Filter */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-1.5">
            <FileText size={16} />
            ประวัติทั้งหมด
          </h3>
          
          <div className="relative">
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="px-2 py-1 rounded-lg glass-input text-xs"
            >
              <option value="all" className="bg-[#111928]">ทั้งหมด</option>
              <option value="merit" className="bg-[#111928]">บวกแต้ม</option>
              <option value="demerit" className="bg-[#111928]">ลบแต้ม</option>
            </select>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[500px]">
          {filteredLogs.length === 0 ? (
            <p className="text-center text-xs text-gray-500 py-10">ไม่พบประวัติพฤติกรรม</p>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id} 
                className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 ${
                  log.type === 'merit' 
                    ? 'bg-emerald-500/5 border-emerald-500/10' 
                    : 'bg-rose-500/5 border-rose-500/10'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{log.studentName}</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded ${
                    log.type === 'merit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {log.points > 0 ? `+${log.points}` : log.points}
                  </span>
                </div>
                <p className="text-gray-300 font-medium text-[11px]">{log.reason}</p>
                
                <span className="text-[9px] text-gray-500 self-end font-mono">
                  {new Date(log.timestamp).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
