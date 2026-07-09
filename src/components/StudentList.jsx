import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import { Search, UserPlus, Edit2, Trash2, Shield, Heart, Phone, Filter } from 'lucide-react';
import StudentForm from './StudentForm';

export default function StudentList() {
  const { students, addStudent, updateStudent, deleteStudent } = useClass();
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // การกรองข้อมูล
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm);
    
    const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
    const matchesRole = roleFilter === 'all' || student.role === roleFilter;

    return matchesSearch && matchesGender && matchesRole;
  });

  const handleOpenAddForm = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleCloseForm = (formData) => {
    setIsFormOpen(false);
    if (formData) {
      if (editingStudent) {
        updateStudent(editingStudent.id, formData);
      } else {
        addStudent(formData);
      }
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ "${name}"?`)) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">รายชื่อนักเรียนในห้อง</h2>
          <p className="text-sm text-gray-400">ค้นหา แก้ไข เพิ่ม หรือลบข้อมูลสมาชิกในห้องเรียน</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <UserPlus size={18} />
          เพิ่มนักเรียนใหม่
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 gap-4 p-5 rounded-2xl glass-panel md:grid-cols-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ, ชื่อเล่น หรือรหัสนักเรียน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        {/* Gender Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-sm appearance-none"
          >
            <option value="all" className="bg-[#111928]">ทุกเพศ</option>
            <option value="male" className="bg-[#111928]">เพศชาย</option>
            <option value="female" className="bg-[#111928]">เพศหญิง</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-sm"
          >
            <option value="all" className="bg-[#111928]">ทุกตำแหน่ง</option>
            <option value="สมาชิกทั่วไป" className="bg-[#111928]">สมาชิกทั่วไป</option>
            <option value="หัวหน้าห้อง" className="bg-[#111928]">หัวหน้าห้อง</option>
            <option value="รองหัวหน้าห้อง" className="bg-[#111928]">รองหัวหน้าห้อง</option>
            <option value="เหรัญญิก" className="bg-[#111928]">เหรัญญิก</option>
            <option value="บรรณารักษ์" className="bg-[#111928]">บรรณารักษ์</option>
            <option value="เวรประจำวัน" className="bg-[#111928]">เวรประจำวัน</option>
          </select>
        </div>
      </div>

      {/* Student List Cards/Grid */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl glass-panel">
          <div className="p-4 mb-4 rounded-full bg-white/5 text-gray-400">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white">ไม่พบข้อมูลนักเรียน</h3>
          <p className="max-w-xs text-sm text-gray-400 mt-1">ทดลองค้นหาโดยใช้ชื่ออื่น หรือเคลียร์ฟิลเตอร์กรองข้อมูล</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <div 
              key={student.id} 
              className="flex flex-col justify-between p-5 rounded-2xl glass-panel hover:border-violet-500/40 hover:glow-purple transition-all group duration-300"
            >
              {/* Top Row: Gender Avatar & Details */}
              <div className="flex items-start gap-4">
                {/* Avatar Icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold shrink-0 ${
                  student.gender === 'male' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' 
                    : 'bg-pink-500/20 text-pink-400 border border-pink-500/20'
                }`}>
                  {student.nickname[0] || 'น'}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-gray-400 font-mono">#{student.studentId}</span>
                    {student.role !== 'สมาชิกทั่วไป' && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        <Shield size={10} />
                        {student.role}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                    {student.name} ({student.nickname})
                  </h4>
                </div>
              </div>

              {/* Middle Row: Stats Grid */}
              <div className="grid grid-cols-3 gap-2 py-4 my-3 border-y border-white/5 text-center text-xs">
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase">กรุ๊ปเลือด</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-gray-300 mt-0.5">
                    <Heart size={12} className="text-red-500/80 fill-red-500/20" />
                    {student.bloodType}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase">ความประพฤติ</span>
                  <span className={`font-semibold mt-0.5 block ${
                    student.points >= 100 
                      ? 'text-emerald-400' 
                      : student.points >= 80 
                        ? 'text-amber-400' 
                        : 'text-rose-400'
                  }`}>
                    {student.points} แต้ม
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase">เพศ</span>
                  <span className={`font-semibold mt-0.5 block ${
                    student.gender === 'male' ? 'text-blue-400' : 'text-pink-400'
                  }`}>
                    {student.gender === 'male' ? 'ชาย' : 'หญิง'}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Contact & Actions */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1 text-gray-400">
                  <Phone size={12} />
                  {student.contact}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditForm(student)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    title="แก้ไขข้อมูล"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id, student.name)}
                    className="p-2 text-rose-400/80 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="ลบรายชื่อ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        studentToEdit={editingStudent}
      />
    </div>
  );
}
