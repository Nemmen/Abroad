import React from 'react';
import { Building, Briefcase, DollarSign, Users } from 'lucide-react'

export function ProfessionalInfo({ agent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoItem icon={<Building className="w-5 h-5" />} label="Organization" value={agent.organization} />
      <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Role" value={agent.role} />
      <InfoItem icon={<DollarSign className="w-5 h-5" />} label="Business Division" value={agent.businessDivision} />
      <InfoItem icon={<Users className="w-5 h-5" />} label="Approved By" value={agent.approvedBy?.name} />
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-gray-500">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  )
}

