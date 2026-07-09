import React, { createContext, useContext, useState, useEffect } from 'react';

const ClassContext = createContext();

// สมาชิกเริ่มต้น (Mock Data)
const initialStudents = [
  { id: '1', studentId: '10101', name: 'นายปกรณ์ศักดิ์ แก้ววิเชียร', nickname: 'ป๊อป', gender: 'male', role: 'หัวหน้าห้อง', contact: '081-234-5678', bloodType: 'A', points: 105 },
  { id: '2', studentId: '10102', name: 'นางสาวกุลธิดา เลิศรักษา', nickname: 'แนน', gender: 'female', role: 'รองหัวหน้าห้อง', contact: '082-345-6789', bloodType: 'B', points: 110 },
  { id: '3', studentId: '10103', name: 'นายพงศกร สิริวัฒน์', nickname: 'นนท์', gender: 'male', role: 'สมาชิกทั่วไป', contact: '083-456-7890', bloodType: 'O', points: 95 },
  { id: '4', studentId: '10104', name: 'นางสาวธนพร พรประเสริฐ', nickname: 'พลอย', gender: 'female', role: 'เหรัญญิก', contact: '084-567-8901', bloodType: 'AB', points: 100 },
  { id: '5', studentId: '10105', name: 'นายณัฐวุฒิ สมบูรณ์', nickname: 'บอส', gender: 'male', role: 'บรรณารักษ์', contact: '085-678-9012', bloodType: 'O', points: 90 },
  { id: '6', studentId: '10106', name: 'นางสาวอริสา มีสุข', nickname: 'มายด์', gender: 'female', role: 'สมาชิกทั่วไป', contact: '086-789-0123', bloodType: 'A', points: 102 },
  { id: '7', studentId: '10107', name: 'นายชลทิศ ทองดี', nickname: 'เจมส์', gender: 'male', role: 'สมาชิกทั่วไป', contact: '087-890-1234', bloodType: 'B', points: 100 },
  { id: '8', studentId: '10108', name: 'นางสาวณิชาภา บุญศรี', nickname: 'ฟ้า', gender: 'female', role: 'สมาชิกทั่วไป', contact: '088-901-2345', bloodType: 'A', points: 98 },
  { id: '9', studentId: '10109', name: 'นายภูมิรพี เกษมสุข', nickname: 'ดิว', gender: 'male', role: 'สมาชิกทั่วไป', contact: '089-012-3456', bloodType: 'O', points: 100 },
  { id: '10', studentId: '10110', name: 'นางสาวมนัสวี นิลพัฒน์', nickname: 'มุก', gender: 'female', role: 'สมาชิกทั่วไป', contact: '081-123-4567', bloodType: 'AB', points: 100 },
  { id: '11', studentId: '10111', name: 'นายกิตติภพ ดำรงค์', nickname: 'เต้ย', gender: 'male', role: 'สมาชิกทั่วไป', contact: '082-234-5678', bloodType: 'B', points: 105 },
  { id: '12', studentId: '10112', name: 'นางสาวภัทรวดี ทรัพย์สิน', nickname: 'วิว', gender: 'female', role: 'สมาชิกทั่วไป', contact: '083-345-6789', bloodType: 'O', points: 85 }
];

// ประวัติความประพฤติเริ่มต้น
const initialBehaviorLogs = [
  { id: 'log1', studentId: '10101', studentName: 'นายปกรณ์ศักดิ์ แก้ววิเชียร', type: 'merit', points: 5, reason: 'ช่วยครูยกของและจัดกิจกรรมห้องเรียน', timestamp: '2026-07-08T10:15:00Z' },
  { id: 'log2', studentId: '10102', studentName: 'นางสาวกุลธิดา เลิศรักษา', type: 'merit', points: 10, reason: 'ได้รางวัลชนะเลิศการประกวดสุนทรพจน์', timestamp: '2026-07-08T11:30:00Z' },
  { id: 'log3', studentId: '10103', studentName: 'นายพงศกร สิริวัฒน์', type: 'demerit', points: -5, reason: 'มาสายเกินกำหนดเข้าแถว', timestamp: '2026-07-09T08:10:00Z' },
  { id: 'log5', studentId: '10112', studentName: 'นางสาวภัทรวดี ทรัพย์สิน', type: 'demerit', points: -15, reason: 'ไม่ส่งงานวิชาคณิตศาสตร์ตามกำหนด', timestamp: '2026-07-09T08:45:00Z' }
];

// ประวัติการเข้าเรียนเริ่มต้น
const initialAttendanceLogs = [
  {
    date: '2026-07-08',
    records: {
      '1': 'present', '2': 'present', '3': 'present', '4': 'present', '5': 'present', '6': 'present',
      '7': 'present', '8': 'present', '9': 'present', '10': 'present', '11': 'present', '12': 'present'
    }
  },
  {
    date: '2026-07-09',
    records: {
      '1': 'present', '2': 'present', '3': 'late', '4': 'present', '5': 'sick', '6': 'present',
      '7': 'present', '8': 'present', '9': 'present', '10': 'present', '11': 'present', '12': 'absent'
    }
  }
];

// ผังที่นั่งเริ่มต้น (ขนาด 5 แถว x 6 คอลัมน์)
// เก็บตำแหน่งที่นั่งเป็น row, col และ id ของนักเรียน
const createInitialSeating = () => {
  const grid = Array(5).fill(null).map(() => Array(6).fill(null));
  // วางนักเรียนลงในผังที่นั่ง
  grid[0][0] = '1';
  grid[0][1] = '2';
  grid[0][4] = '3';
  grid[0][5] = '4';
  grid[1][1] = '5';
  grid[1][2] = '6';
  grid[2][2] = '7';
  grid[2][3] = '8';
  grid[3][0] = '9';
  grid[3][5] = '10';
  grid[4][2] = '11';
  grid[4][3] = '12';
  return grid;
};

export const ClassProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('class_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [behaviorLogs, setBehaviorLogs] = useState(() => {
    const saved = localStorage.getItem('class_behavior_logs');
    return saved ? JSON.parse(saved) : initialBehaviorLogs;
  });

  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('class_attendance_logs');
    return saved ? JSON.parse(saved) : initialAttendanceLogs;
  });

  const [seatingGrid, setSeatingGrid] = useState(() => {
    const saved = localStorage.getItem('class_seating_grid');
    return saved ? JSON.parse(saved) : createInitialSeating();
  });

  // บันทึกลง LocalStorage ทุกครั้งที่สเตทเปลี่ยน
  useEffect(() => {
    localStorage.setItem('class_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('class_behavior_logs', JSON.stringify(behaviorLogs));
  }, [behaviorLogs]);

  useEffect(() => {
    localStorage.setItem('class_attendance_logs', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem('class_seating_grid', JSON.stringify(seatingGrid));
  }, [seatingGrid]);

  // ค้นหานักเรียนด้วยไอดี
  const getStudentById = (id) => students.find(s => s.id === id);

  // ฟังก์ชัน CRUD นักเรียน
  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      points: Number(studentData.points) || 100
    };
    setStudents(prev => [...prev, newStudent]);
    
    // จัดวางที่นั่งแรกที่ว่างโดยอัตโนมัติ
    setSeatingGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 6; c++) {
          if (newGrid[r][c] === null) {
            newGrid[r][c] = newStudent.id;
            return newGrid;
          }
        }
      }
      return newGrid;
    });
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData, points: Number(updatedData.points) } : s));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    // ลบที่นั่งของนักเรียนคนนี้ออกจากผัง
    setSeatingGrid(prevGrid => prevGrid.map(row => row.map(cell => cell === id ? null : cell)));
  };

  // ฟังก์ชันเช็คชื่อประจำวัน
  const saveAttendance = (date, records) => {
    setAttendanceLogs(prev => {
      const existingIndex = prev.findIndex(log => log.date === date);
      if (existingIndex >= 0) {
        const newLogs = [...prev];
        newLogs[existingIndex] = { date, records };
        return newLogs;
      } else {
        return [...prev, { date, records }];
      }
    });
  };

  // ฟังก์ชันจัดการคะแนนพฤติกรรม
  const adjustPoints = (studentId, amount, reason) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    const change = Number(amount);
    const newPoints = targetStudent.points + change;

    // อัปเดตคะแนน
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, points: newPoints } : s));

    // เพิ่ม Log
    const newLog = {
      id: Date.now().toString(),
      studentId: targetStudent.studentId,
      studentName: targetStudent.name,
      type: change >= 0 ? 'merit' : 'demerit',
      points: change,
      reason,
      timestamp: new Date().toISOString()
    };
    setBehaviorLogs(prev => [newLog, ...prev]);
  };

  // ฟังก์ชันสลับ/ตั้งค่าที่นั่ง
  const updateSeat = (row, col, studentId) => {
    setSeatingGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      
      // ถ้านักเรียนมีที่นั่งเดิมอยู่แล้ว ให้ลบออกก่อน (ย้ายที่นั่ง)
      if (studentId !== null) {
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 6; c++) {
            if (newGrid[r][c] === studentId) {
              newGrid[r][c] = null;
            }
          }
        }
      }
      
      newGrid[row][col] = studentId;
      return newGrid;
    });
  };

  // สุ่มจัดที่นั่งใหม่ทั้งหมด
  const shuffleSeats = () => {
    const studentIds = students.map(s => s.id);
    // สับการเรียงลำดับนักเรียน
    const shuffled = [...studentIds].sort(() => Math.random() - 0.5);
    
    setSeatingGrid(() => {
      const newGrid = Array(5).fill(null).map(() => Array(6).fill(null));
      let index = 0;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 6; c++) {
          if (index < shuffled.length) {
            newGrid[r][c] = shuffled[index];
            index++;
          }
        }
      }
      return newGrid;
    });
  };

  return (
    <ClassContext.Provider value={{
      students,
      behaviorLogs,
      attendanceLogs,
      seatingGrid,
      getStudentById,
      addStudent,
      updateStudent,
      deleteStudent,
      saveAttendance,
      adjustPoints,
      updateSeat,
      shuffleSeats
    }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => useContext(ClassContext);
