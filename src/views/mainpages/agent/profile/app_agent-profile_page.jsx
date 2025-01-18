import React from 'react';
import { AgentProfile } from './app_components_AgentProfile'

// const agentData = {
//   _id: "67614dbd6d349a61707ea739",
//   name: "ronit",
//   email: "fgh@gmail.com",
//   userStatus: "active",
//   organization: "quy",
//   role: "user",
//   phoneNumber: "9781996650",
//   state: "Madhya Pradesh",
//   city: "Damtal",
//   businessDivision: "FOREX",
//   createdAt: "2024-12-17T10:09:01.332+00:00",
//   updatedAt: "2024-12-29T07:23:30.224+00:00",
//   agentCode: "AGT0002AE",
//   students: [
//     "676587f8878083f36208cc89",
//     "6765a004b7c8534c72d1f566",
//     "676a51ec535040f5305943d8",
//     "676a54ff535040f5305943e0",
//     "676a557a535040f5305943e7",
//     "676a55e9b563680438829d35",
//     "676a562131268e740b7e2e22",
//     "676a56ab92ff1d2c151768a7",
//     "676a571c398328ef90810623",
//     "676a5790522359037b959d93",
//     "676a586010e21a4dfdecc0b8",
//     "676a5cf52876254cdc25425b",
//     "676a5d12540a7720b4efee93",
//     "676a5d5ee4174af0216784fe",
//     "676a5e9ce4174af021678506",
//     "676a66c9d17cb7257de05ee4",
//     "677038f262678d8cf118ea23",
//     "6770f8f171c4d7435685d65e"
//   ],
//   approvedBy: "672e64e458c4755fbcb99e5a"
// }

export default function AgentProfilePage(agentData) {
  return <AgentProfile agent={agentData.agentData} />
}

