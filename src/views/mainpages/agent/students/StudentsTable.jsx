import React from 'react';

const StudentsTable = ({ students, agen }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Student Code
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Name
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Email
            </th>

            <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Created At
            </th>
            {/* <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Updated At
            </th> */}
            {/* <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Actions
            </th> */}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6 text-gray-800">{student.studentCode}</td>
              <td className="py-3 px-6 text-gray-800">{student.name}</td>
              <td className="py-3 px-6 text-gray-800">{student.email}</td>

              <td className="py-3 px-6 text-gray-800">
                {new Date(student.createdAt).toLocaleString()}
              </td>
              {/* <td className="py-3 px-6 text-gray-800">
                {new Date(student.updatedAt).toLocaleString()}
              </td> */}
              {/* <td className="py-3 px-6">
                <button className="text-blue-500 hover:text-blue-700">
                  Edit
                </button>
                <button className="ml-4 text-red-500 hover:text-red-700">
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
