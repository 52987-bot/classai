import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const ClassContext = createContext();

// ========================================
//  Helper: แปลง snake_case (Supabase) -> camelCase (App)
// ========================================
const mapStudent = (row) => ({
  id: row.id,
  studentId: row.student_id,
  name: row.name,
  nickname: row.nickname,
  gender: row.gender,
  role: row.role,
  contact: row.contact,
  bloodType: row.blood_type,
  points: row.points,
});

const mapBehaviorLog = (row) => ({
  id: row.id,
  studentId: row.student_id,
  studentName: row.student_name,
  type: row.type,
  points: row.points,
  reason: row.reason,
  timestamp: row.timestamp,
});

// ========================================
//  Provider Component
// ========================================
export const ClassProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [behaviorLogs, setBehaviorLogs] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [seatingGrid, setSeatingGrid] = useState(Array(5).fill(null).map(() => Array(6).fill(null)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------------------------
  //  Initial Data Load
  // ----------------------------------------
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, logsRes, attendanceRes, seatingRes] = await Promise.all([
        supabase.from('students').select('*').order('student_id', { ascending: true }),
        supabase.from('behavior_logs').select('*').order('timestamp', { ascending: false }),
        supabase.from('attendance_logs').select('*').order('date', { ascending: false }),
        supabase.from('seating_charts').select('*').eq('id', 'default_layout').single(),
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (logsRes.error) throw logsRes.error;
      if (attendanceRes.error) throw attendanceRes.error;

      setStudents(studentsRes.data.map(mapStudent));
      setBehaviorLogs(logsRes.data.map(mapBehaviorLog));
      setAttendanceLogs(attendanceRes.data.map((r) => ({ date: r.date, records: r.records })));

      if (seatingRes.data) {
        setSeatingGrid(seatingRes.data.grid);
      }
    } catch (err) {
      console.error('Error loading data from Supabase:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ----------------------------------------
  //  Helper
  // ----------------------------------------
  const getStudentById = (id) => students.find((s) => s.id === id);

  // ----------------------------------------
  //  Seating helpers (internal)
  // ----------------------------------------
  const persistSeating = async (grid) => {
    const { error } = await supabase
      .from('seating_charts')
      .upsert({ id: 'default_layout', grid, updated_at: new Date().toISOString() });
    if (error) console.error('Error saving seating chart:', error.message);
  };

  // ----------------------------------------
  //  CRUD — Students
  // ----------------------------------------
  const addStudent = async (studentData) => {
    const insertPayload = {
      student_id: studentData.studentId,
      name: studentData.name,
      nickname: studentData.nickname,
      gender: studentData.gender,
      role: studentData.role,
      contact: studentData.contact,
      blood_type: studentData.bloodType,
      points: Number(studentData.points) || 100,
    };

    const { data, error } = await supabase
      .from('students')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Error adding student:', error.message);
      alert('ไม่สามารถเพิ่มนักเรียนได้: ' + error.message);
      return;
    }

    const newStudent = mapStudent(data);
    setStudents((prev) => [...prev, newStudent]);

    // วางที่นั่งแรกที่ว่างโดยอัตโนมัติ
    setSeatingGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 6; c++) {
          if (newGrid[r][c] === null) {
            newGrid[r][c] = newStudent.id;
            persistSeating(newGrid);
            return newGrid;
          }
        }
      }
      return newGrid;
    });
  };

  const updateStudent = async (id, updatedData) => {
    const updatePayload = {
      student_id: updatedData.studentId,
      name: updatedData.name,
      nickname: updatedData.nickname,
      gender: updatedData.gender,
      role: updatedData.role,
      contact: updatedData.contact,
      blood_type: updatedData.bloodType,
      points: Number(updatedData.points),
    };

    const { error } = await supabase
      .from('students')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating student:', error.message);
      alert('ไม่สามารถแก้ไขข้อมูลได้: ' + error.message);
      return;
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData, points: Number(updatedData.points) } : s))
    );
  };

  const deleteStudent = async (id) => {
    const { error } = await supabase.from('students').delete().eq('id', id);

    if (error) {
      console.error('Error deleting student:', error.message);
      alert('ไม่สามารถลบข้อมูลได้: ' + error.message);
      return;
    }

    setStudents((prev) => prev.filter((s) => s.id !== id));

    // ลบออกจากผังที่นั่งด้วย
    setSeatingGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => (cell === id ? null : cell)));
      persistSeating(newGrid);
      return newGrid;
    });
  };

  // ----------------------------------------
  //  Attendance
  // ----------------------------------------
  const saveAttendance = async (date, records) => {
    const { error } = await supabase
      .from('attendance_logs')
      .upsert({ date, records }, { onConflict: 'date' });

    if (error) {
      console.error('Error saving attendance:', error.message);
      alert('ไม่สามารถบันทึกการเช็คชื่อได้: ' + error.message);
      return;
    }

    setAttendanceLogs((prev) => {
      const existing = prev.findIndex((l) => l.date === date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { date, records };
        return updated;
      }
      return [{ date, records }, ...prev];
    });
  };

  // ----------------------------------------
  //  Behavior Points
  // ----------------------------------------
  const adjustPoints = async (studentId, amount, reason) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    const change = Number(amount);
    const newPoints = targetStudent.points + change;

    // อัปเดตคะแนนในตาราง students
    const { error: pointsError } = await supabase
      .from('students')
      .update({ points: newPoints })
      .eq('id', studentId);

    if (pointsError) {
      console.error('Error updating points:', pointsError.message);
      alert('ไม่สามารถอัปเดตคะแนนได้: ' + pointsError.message);
      return;
    }

    // บันทึก Log พฤติกรรม
    const logPayload = {
      student_id: targetStudent.studentId,
      student_name: targetStudent.name,
      type: change >= 0 ? 'merit' : 'demerit',
      points: change,
      reason,
      timestamp: new Date().toISOString(),
    };

    const { data: logData, error: logError } = await supabase
      .from('behavior_logs')
      .insert(logPayload)
      .select()
      .single();

    if (logError) {
      console.error('Error inserting behavior log:', logError.message);
    }

    // อัปเดต State
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, points: newPoints } : s))
    );

    if (logData) {
      setBehaviorLogs((prev) => [mapBehaviorLog(logData), ...prev]);
    }
  };

  // ----------------------------------------
  //  Seating Chart
  // ----------------------------------------
  const updateSeat = (row, col, studentId) => {
    setSeatingGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);

      // ลบนักเรียนออกจากที่นั่งเดิม (ถ้ามี) เพื่อทำการย้าย
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
      persistSeating(newGrid);
      return newGrid;
    });
  };

  const shuffleSeats = () => {
    const studentIds = students.map((s) => s.id);
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
      persistSeating(newGrid);
      return newGrid;
    });
  };

  return (
    <ClassContext.Provider
      value={{
        students,
        behaviorLogs,
        attendanceLogs,
        seatingGrid,
        loading,
        error,
        fetchAll,
        getStudentById,
        addStudent,
        updateStudent,
        deleteStudent,
        saveAttendance,
        adjustPoints,
        updateSeat,
        shuffleSeats,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => useContext(ClassContext);
