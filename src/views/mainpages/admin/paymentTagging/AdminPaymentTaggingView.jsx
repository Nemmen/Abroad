// Admin Payment Tagging View - Same as Agent View but with different navigation path
import AgentPaymentTaggingView from '../../agent/paymentTagging/AgentPaymentTaggingView';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

function AdminPaymentTaggingView() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Override edit button navigation to admin path
  const handleEdit = () => {
    navigate(`/admin/payment-tagging/form/${id}`);
  };

  // We can reuse the Agent view component
  return <AgentPaymentTaggingView isAdmin={true} onEdit={handleEdit} />;
}

export default AdminPaymentTaggingView;
