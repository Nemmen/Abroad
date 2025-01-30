import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StudentsTable from './StudentsTable';

const StudentPage = () => {
  const { user } = useSelector((state) => state.Auth);
  const [students, setStudents] = useState([]);
  // console.log("students before useeffect", students)

  useEffect(() => {
    // Assuming useer?.students fetches the corrct student data
    setStudents(user?.students || []); 
  }, [user]);

  // console.log("students after useeffect", students)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Students</h1>
      <StudentsTable students={students} />
    </div>
  );
};

export default StudentPage;