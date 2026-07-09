import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import { Users, Shuffle, Award, CheckCircle, RefreshCw } from 'lucide-react';

export default function GroupGenerator() {
  const { students } = useClass();
  const [groupMode, setGroupMode] = useState('count'); // 'count' = จำนวนกลุ่ม, 'size' = จำนวนคนต่อกลุ่ม
  const [targetValue, setTargetValue] = useState(3);
  const [balanceGender, setBalanceGender] = useState(true);
  const [groups, setGroups] = useState([]);

  // ฟังก์ชันสุ่มจัดกลุ่ม
  const generateGroups = () => {
    if (students.length === 0) {
      alert('กรุณาเพิ่มรายชื่อนักเรียนก่อนทำการแบ่งกลุ่ม');
      return;
    }

    let boys = students.filter(s => s.gender === 'male');
    let girls = students.filter(s => s.gender === 'female');
    
    // สับตำแหน่งแบบสุ่ม
    boys = [...boys].sort(() => Math.random() - 0.5);
    girls = [...girls].sort(() => Math.random() - 0.5);

    // คำนวณจำนวนกลุ่มที่จะสร้าง
    let numGroups = 3;
    if (groupMode === 'count') {
      numGroups = Math.max(1, Math.min(students.length, Number(targetValue)));
    } else {
      const size = Math.max(1, Math.min(students.length, Number(targetValue)));
      numGroups = Math.ceil(students.length / size);
    }

    // สร้างกล่องส้นกลุ่มเปล่าๆ
    const resultGroups = Array.from({ length: numGroups }, (_, i) => ({
      id: i + 1,
      name: `กลุ่มที่ ${i + 1}`,
      members: []
    }));

    if (balanceGender) {
      // สลับหยอดผู้ชายและผู้หญิงลงในกลุ่มให้เฉลี่ยกันมากที่สุด
      let currentGroupIndex = 0;
      boys.forEach(boy => {
        resultGroups[currentGroupIndex].members.push(boy);
        currentGroupIndex = (currentGroupIndex + 1) % numGroups;
      });

      // ดำเนินการต่อด้วยเด็กหญิงเพื่อให้เพศเฉลี่ยเท่ากัน
      girls.forEach(girl => {
        resultGroups[currentGroupIndex].members.push(girl);
        currentGroupIndex = (currentGroupIndex + 1) % numGroups;
      });
    } else {
      // สุ่มคละไม่สนใจเพศ
      const allStudents = [...students].sort(() => Math.random() - 0.5);
      allStudents.forEach((student, idx) => {
        const groupIndex = idx % numGroups;
        resultGroups[groupIndex].members.push(student);
      });
    }

    setGroups(resultGroups);
  };

  const handleReset = () => {
    setGroups([]);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">ระบบสุ่มจัดกลุ่มนักเรียน</h2>
        <p className="text-sm text-gray-400">แบ่งกลุ่มนักเรียนสำหรับการทำงานกลุ่ม โครงงาน หรือการทำกิจกรรมพิเศษ</p>
      </div>

      {/* Control Panel Card */}
      <div className="p-6 rounded-2xl glass-panel grid grid-cols-1 gap-6 md:grid-cols-4 items-end">
        {/* Mode Selector */}
        <div>
          <label className="block mb-2 text-xs font-semibold text-gray-400 uppercase">รูปแบบการแบ่งกลุ่ม:</label>
          <select
            value={groupMode}
            onChange={(e) => {
              setGroupMode(e.target.value);
              setTargetValue(e.target.value === 'count' ? 3 : 4);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          >
            <option value="count" className="bg-[#111928]">กำหนดจำนวนกลุ่ม</option>
            <option value="size" className="bg-[#111928]">กำหนดจำนวนคนต่อกลุ่ม</option>
          </select>
        </div>

        {/* Input Value */}
        <div>
          <label className="block mb-2 text-xs font-semibold text-gray-400 uppercase">
            {groupMode === 'count' ? 'ระบุจำนวนกลุ่ม (กลุ่ม):' : 'ระบุสมาชิกกลุ่มละ (คน):'}
          </label>
          <input
            type="number"
            min="1"
            max={students.length || 30}
            value={targetValue}
            onChange={(e) => setTargetValue(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Gender Balance Toggle */}
        <div className="flex items-center h-11">
          <label className="flex items-center gap-2 text-sm text-gray-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={balanceGender}
              onChange={(e) => setBalanceGender(e.target.checked)}
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-white/5 border-white/10"
            />
            เฉลี่ยสัดส่วนเพศ (ชาย/หญิง)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={generateGroups}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all cursor-pointer"
          >
            <Shuffle size={16} />
            สุ่มแบ่งกลุ่ม
          </button>
          
          {groups.length > 0 && (
            <button
              onClick={handleReset}
              className="p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
              title="ล้างข้อมูลกลุ่ม"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Group Results display */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl glass-panel">
          <div className="p-4 mb-4 rounded-full bg-white/5 text-gray-400">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white">ยังไม่มีการสุ่มกลุ่ม</h3>
          <p className="max-w-xs text-sm text-gray-400 mt-1">กำหนดจำนวนที่ต้องการทางด้านบนแล้วกด "สุ่มแบ่งกลุ่ม" เพื่อดูผลลัพธ์</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.id} className="p-5 rounded-2xl glass-panel flex flex-col justify-between border-t-2 border-violet-500/80">
              <div>
                {/* Group title and stats */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <h4 className="font-bold text-white text-base">{group.name}</h4>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-violet-600/20 text-violet-400 border border-violet-500/10 rounded-md">
                    {group.members.length} คน
                  </span>
                </div>

                {/* Members list */}
                <div className="space-y-2">
                  {group.members.map((member, idx) => (
                    <div 
                      key={member.id} 
                      className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold ${
                        member.gender === 'male' 
                          ? 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/5 text-blue-400' 
                          : 'bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/5 text-pink-400'
                      }`}
                    >
                      <span className="text-gray-300 font-mono text-[10px]">{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className="flex-1 pl-3 text-left truncate text-white">{member.name} ({member.nickname})</span>
                      <span className="text-[10px] text-gray-500 uppercase font-mono">{member.gender === 'male' ? 'M' : 'F'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
