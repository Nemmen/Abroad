import React from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'

export function PersonalInfo({ agent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={agent.email} />
      <InfoItem icon={<Phone className="w-5 h-5" />} label="Phone" value={agent.phoneNumber} />
      <InfoItem icon={<MapPin className="w-5 h-5" />} label="City" value={agent.city} />
      <InfoItem icon={<MapPin className="w-5 h-5" />} label="State" value={agent.state} />
      {/* <InfoItem icon={<Calendar className="w-5 h-5" />} label="Created At" value={new Date(agent.createdAt).toLocaleString()} />
      <InfoItem icon={<Calendar className="w-5 h-5" />} label="Updated At" value={new Date(agent.updatedAt).toLocaleString()} /> */}
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

