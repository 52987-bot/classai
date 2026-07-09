import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import { Shuffle, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function SeatingChart() {
  const { students, seatingGrid, updateSeat, shuffleSeats } = useClass();
  const [selectedSeat, setSelectedSeat] = useState(null); // { row, col } ของที่นั่งที่ถูกคลิกเลือกเพื่อย้าย/สลับ

  // ค้นหานักเรียนในที่นั่งนั้นๆ
  const getStudentInSeat = (studentId) => {
    return students.find(s => s.id === studentId);
  };

  const handleSeatClick = (row, col) => {
    const clickedStudentId = seatingGrid[row][col];

    if (selectedSeat === null) {
      // ถ้ายังไม่มีที่นั่งที่เลือก ให้เลือกที่นั่งนี้
      setSelectedSeat({ row, col });
    } else {
      // ถ้าเลือกที่นั่งไว้แล้ว และคลิกอีกทีที่เดิม -> ยกเลิกการเลือก
      if (selectedSeat.row === row && selectedSeat.col === col) {
        setSelectedSeat(null);
        return;
      }

      // ทำการสลับที่นั่ง (Swap seats)
      const firstStudentId = seatingGrid[selectedSeat.row][selectedSeat.col];
      const secondStudentId = clickedStudentId;

      // อัปเดตสเตทของที่นั่ง
      updateSeat(row, col, firstStudentId);
      updateSeat(selectedSeat.row, selectedSeat.col, secondStudentId);
      
      // ล้างข้อมูลที่เลือก
      setSelectedSeat(null);
    }
  };

  // หานักเรียนที่อยู่นอกผัง (ตกหล่นหรือยังไม่มีที่นั่ง)
  const getUnseatedStudents = () => {
    const seatedIds = seatingGrid.flat().filter(id => id !== null);
    return students.filter(s => !seatedIds.includes(s.id));
  };

  const unseatedStudents = getUnseatedStudents();

  // วางนักเรียนที่ไม่มีที่นั่งลงในช่องว่างแรก
  const handleAssignUnseated = (studentId) => {
    // ค้นหาช่องว่างแรกในตาราง
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 6; c++) {
        if (seatingGrid[r][c] === null) {
          updateSeat(r, c, studentId);
          return;
        }
      }
    }
    alert('ที่นั่งในห้องเต็มแล้ว! กรุณาเว้นที่ว่างก่อนจัดนักเรียนใหม่');
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">ผังที่นั่งในห้องเรียน (Seating Chart)</h2>
          <p className="text-sm text-gray-400">จำลองผังที่นั่ง จัดการย้ายที่นั่งด้วยการคลิกเลือกสองช่องเพื่อสลับตำแหน่งกัน</p>
        </div>
        
        {/* Actions */}
        <button
          onClick={shuffleSeats}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all cursor-pointer"
        >
          <Shuffle size={16} />
          สุ่มจัดที่นั่งใหม่ทั้งหมด
        </button>
      </div>

      {/* Classroom layout visualizer */}
      <div className="p-6 rounded-2xl glass-panel space-y-6 flex flex-col items-center">
        {/* Front of class (Teacher desk & Blackboard) */}
        <div className="w-full max-w-lg py-2 rounded-lg bg-slate-800 border border-slate-700 text-center text-xs font-bold text-gray-400 tracking-wider shadow-inner uppercase mb-4 relative">
          📺 หน้าห้องเรียน (กระดานดำ & โต๊ะครู)
          <div className="absolute top-1/2 left-4 -translate-y-1/2 w-4 h-2 rounded bg-violet-500/30 border border-violet-500/50" />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-2 rounded bg-violet-500/30 border border-violet-500/50" />
        </div>

        {/* Grid of seats */}
        <div className="w-full overflow-x-auto pb-4 flex justify-center">
          <div className="grid grid-cols-6 gap-3 sm:gap-4 min-w-[650px] max-w-4xl p-2 bg-black/10 rounded-2xl border border-white/5">
            {seatingGrid.map((row, rIdx) => 
              row.map((studentId, cIdx) => {
                const student = studentId ? getStudentInSeat(studentId) : null;
                const isSelected = selectedSeat && selectedSeat.row === rIdx && selectedSeat.col === cIdx;

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handleSeatClick(rIdx, cIdx)}
                    className={`h-20 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer border relative select-none ${
                      isSelected
                        ? 'border-violet-400 bg-violet-600/20 glow-purple ring-2 ring-violet-500/50 scale-105'
                        : student
                          ? student.gender === 'male'
                            ? 'bg-blue-500/5 border-blue-500/20 text-blue-400 hover:bg-blue-500/10'
                            : 'bg-pink-500/5 border-pink-500/20 text-pink-400 hover:bg-pink-500/10'
                          : 'bg-transparent border-dashed border-white/10 text-gray-600 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {student ? (
                      <>
                        {/* Student Name */}
                        <span className="text-[10px] font-mono text-gray-400 uppercase">
                          แถว {rIdx + 1}-{cIdx + 1}
                        </span>
                        <span className="font-bold text-xs text-white truncate max-w-full mt-1">
                          {student.nickname}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono mt-0.5 truncate max-w-full">
                          #{student.studentId}
                        </span>
                        
                        {/* Mini indicator badge for roles */}
                        {student.role !== 'สมาชิกทั่วไป' && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500" title={student.role} />
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-[9px] text-gray-500">แถว {rIdx + 1}-{cIdx + 1}</span>
                        <span className="text-xs font-semibold text-gray-600 mt-1">ว่าง</span>
                      </>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Tip */}
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs max-w-lg text-center">
          <HelpCircle size={16} className="shrink-0" />
          <span><b>วิธีเปลี่ยนตำแหน่ง:</b> คลิกเลือกที่นั่งของนักเรียนคนแรก (จะมีขอบเรืองแสงสีม่วง) จากนั้นคลิกเลือกที่นั่งของนักเรียนคนถัดไป หรือช่องว่าง เพื่อทำการย้ายหรือสลับตำแหน่งโดยอัตโนมัติ</span>
        </div>
      </div>

      {/* Unseated students list (if any) */}
      {unseatedStudents.length > 0 && (
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle size={18} />
            <h3 className="font-bold">นักเรียนที่ยังไม่มีที่นั่ง ({unseatedStudents.length} คน)</h3>
          </div>
          <p className="text-xs text-gray-400">มีนักเรียนบางคนยังไม่ได้ถูกจัดลงในผังที่นั่ง สามารถคลิกเพื่อเพิ่มลงในผังที่ว่าง</p>
          
          <div className="flex flex-wrap gap-2">
            {unseatedStudents.map(student => (
              <button
                key={student.id}
                onClick={() => handleAssignUnseated(student.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold hover:-translate-y-0.5 transition-all cursor-pointer ${
                  student.gender === 'male'
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
                    : 'bg-pink-500/10 border-pink-500/20 text-pink-400 hover:bg-pink-500/20'
                }`}
              >
                ➕ {student.name} ({student.nickname})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
