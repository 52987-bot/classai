import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, Sparkles } from 'lucide-react';

export default function StudentForm({ isOpen, onClose, studentToEdit }) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    nickname: '',
    gender: 'male',
    role: 'สมาชิกทั่วไป',
    contact: '',
    bloodType: 'O',
    points: 100
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData(studentToEdit);
    } else {
      setFormData({
        studentId: '',
        name: '',
        nickname: '',
        gender: 'male',
        role: 'สมาชิกทั่วไป',
        contact: '',
        bloodType: 'O',
        points: 100
      });
    }
  }, [studentToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl glass-panel glow-purple animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-violet-600/30 text-violet-400">
              <UserPlus size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {studentToEdit ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => { e.preventDefault(); onClose(formData); }} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* รหัสประจำตัว */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block mb-1 text-xs font-medium text-gray-400 uppercase">รหัสประจำตัวนักเรียน</label>
              <input
                required
                type="text"
                name="studentId"
                placeholder="เช่น 10101"
                maxLength={5}
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-sm"
              />
            </div>

            {/* ชื่อเล่น */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block mb-1 text-xs font-medium text-gray-400 uppercase">ชื่อเล่น</label>
              <input
                required
                type="text"
                name="nickname"
                placeholder="เช่น ป๊อป"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-sm"
              />
            </div>

            {/* ชื่อ-นามสกุล */}
            <div className="col-span-2">
              <label className="block mb-1 text-xs font-medium text-gray-400 uppercase">ชื่อ - นามสกุล</label>
              <input
                required
                type="text"
                name="name"
                placeholder="เช่น นายสมชาย แสนดี"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-sm"
              />
            </div>

            {/* เพศ */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-400 uppercase">เพศ</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg glass-input text-sm"
              >
                <option value="male" className="bg-[#111928]">ชาย</option>
                <option value="female" className="bg-[#111928]">หญิง</option>
              </select>
            </div>

            {/* หมู่เลือด */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-400 uppercase">กรุ๊ปเลือด</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg glass-input text-sm"
              >
                <option value="A" className="bg-[#111928]">A</option>
                <option value="B" className="bg-[#111928]">B</option>
                <option value="O" className="bg-[#111928]">O</option>
                <option value="AB" className="bg-[#111928]">AB</option>
              </select>
            </div>

            {/* บทบาท/ตำแหน่ง */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-400 uppercase">ตำแหน่งในห้องเรียน</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg glass-input text-sm"
              >
                <option value="สมาชิกทั่วไป" className="bg-[#111928]">สมาชิกทั่วไป</option>
                <option value="หัวหน้าห้อง" className="bg-[#111928]">หัวหน้าห้อง</option>
                <option value="รองหัวหน้าห้อง" className="bg-[#111928]">รองหัวหน้าห้อง</option>
                <option value="เหรัญญิก" className="bg-[#111928]">เหรัญญิก</option>
                <option value="บรรณารักษ์" className="bg-[#111928]">บรรณารักษ์</option>
                <option value="เวรประจำวัน" className="bg-[#111928]">เวรประจำวัน</option>
              </select>
            </div>

            {/* คะแนนความประพฤติ */}
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-400 uppercase">คะแนนความประพฤติเริ่มต้น</label>
              <input
                required
                type="number"
                name="points"
                min="0"
                max="200"
                value={formData.points}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-sm"
              />
            </div>

            {/* เบอร์โทรศัพท์ผู้ปกครอง */}
            <div className="col-span-2">
              <label className="block mb-1 text-xs font-medium text-gray-400 uppercase">เบอร์โทรศัพท์ผู้ปกครอง</label>
              <input
                required
                type="tel"
                name="contact"
                placeholder="เช่น 089-XXXXXXX"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-sm"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg shadow-lg hover:shadow-violet-600/30 transition-all cursor-pointer"
            >
              <Save size={16} />
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
