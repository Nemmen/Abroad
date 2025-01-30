import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StudentsTable from './StudentsTable';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';

const StudentPage = () => {
  const { user } = useSelector((state) => state.Auth);
  const [students, setStudents] = useState([]);
  // console.log("students before useeffect", students)

  const handleSearch = (e) => {
    const search = e.target.value;
    if (search === '') {
      setStudents(user?.students || []);
    } else {
      const filteredStudents = user?.students.filter((student) => {
        return (
          student?.name?.toLowerCase().includes(search.toLowerCase())
         
        );
      });
      setStudents(filteredStudents);
    }
  };

  useEffect(() => {
    // Assuming useer?.students fetches the corrct student data
    setStudents(user?.students || []);
  }, [user]);

  // console.log("students after useeffect", students)
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold mb-4">Manage Students</h1>
        <div className="bg-white p-2 rounded-full">
          <SearchBar
            mb={'unset'}
            handleSearch={handleSearch}
            borderRadius="30px"
          />
        </div>
      </div>
      <StudentsTable students={students} />
    </div>
  );
};

export default StudentPage;
