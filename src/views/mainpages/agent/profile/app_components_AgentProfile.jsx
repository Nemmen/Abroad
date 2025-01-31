import React from 'react';
import { PersonalInfo } from "./app_components_PersonalInfo"
import { ProfessionalInfo } from "./app_components_ProfessionalInfo"
import { StudentList } from "./app_components_StudentList"
import { User, Briefcase, GraduationCap } from 'lucide-react'
import clsx from "clsx";

export function Badge({ children, variant = "default", className, ...props }) {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-300",
    success: "bg-green-100 text-green-800 border-green-300",
    destructive: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <span
      className={clsx(
        "inline-block rounded-md text-sm font-medium px-3 py-1 border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}


export function AgentProfile({ agent }) {
  return (
    <div className="min-h-screen  py-8">
      <div className="container mx-auto px-4 space-y-8">
        <header className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-[#f68c00]">
              {agent.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{agent.name.toUpperCase()}</h1>
              <p className="text-xl mt-2 text-gray-600">{agent.agentCode}</p>
              <Badge 
                variant={agent.userStatus === 'active' ? 'success' : 'destructive'} 
                className={`mt-2 text-lg px-3 py-1 ${agent.userStatus === 'active' ? 'bg-green-100 text-green-800 border-green-300' : ''}`}
              >
                {agent.userStatus}
              </Badge>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SectionCard title="Personal Information" icon={<User className="w-6 text-[#f68c00] h-6" />}>
            <PersonalInfo agent={agent} />
          </SectionCard>
          <SectionCard title="Professional Information" icon={<Briefcase className="w-6 text-[#f68c00] h-6" />}>
            <ProfessionalInfo agent={agent} />
          </SectionCard>
        </section>

        <SectionCard title="Students" icon={<GraduationCap className="w-6 text-[#f68c00] h-6" />}>
          <StudentList students={agent.students} />
        </SectionCard>
      </div>
    </div>
  )
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center space-x-4 p-6 border-b border-gray-200">
        <div className="text-blue-600">{icon}</div>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

