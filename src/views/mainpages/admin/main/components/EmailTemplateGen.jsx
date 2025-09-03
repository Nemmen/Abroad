
import React, { useState, useEffect } from "react";
import axios from "axios";


export default function EmailTemplateGen() {
  const [sections, setSections] = useState([
    { content: "", image: null }
  ]);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'status'
  const [currentTemplateId, setCurrentTemplateId] = useState(null);

  const handleContentChange = (e, idx) => {
    const value = e.target.value;
    setSections((prev) =>
      prev.map((sec, i) => (i === idx ? { ...sec, content: value } : sec))
    );
  };

  const handleImageChange = (e, idx) => {
    const file = e.target.files[0];
    setSections((prev) =>
      prev.map((sec, i) => (i === idx ? { ...sec, image: file } : sec))
    );
  };

  const addSection = () => {
    setSections((prev) => [...prev, { content: "", image: null }]);
  };

  const removeSection = (idx) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccessMsg("");
    setErrorMsg("");
    setEmailStatus(null);
    
    try {
      const formData = new FormData();
      sections.forEach((sec, idx) => {
        formData.append(`sections[${idx}][content]`, sec.content);
        if (sec.image) {
          formData.append(`sections[${idx}][image]`, sec.image);
        }
      });
      
      const res = await axios.post(
        "https://abroad-backend-gray.vercel.app/admin/send-promotional-email",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } , withCredentials: true }
      );
      
      setSuccessMsg(res.data.message || "Emails sent!");
      setCurrentTemplateId(res.data.templateId);
      
      // Start checking status every 5 seconds
      if (res.data.templateId) {
        setActiveTab('status');
        checkEmailStatus(res.data.templateId);
      }
      
      // Refresh templates list
      fetchTemplates();
      
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Sending failed");
    }
    setSending(false);
  };

  const checkEmailStatus = async (templateId) => {
    try {
      const res = await axios.get(`https://abroad-backend-gray.vercel.app/admin/email-status/${templateId}` , { withCredentials: true });
      setEmailStatus(res.data);
      
      // If not completed, check again in 5 seconds
      if (!res.data.isCompleted) {
        setTimeout(() => checkEmailStatus(templateId), 5000);
      }
    } catch (err) {
      console.error('Error checking email status:', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get('https://abroad-backend-gray.vercel.app/admin/email-templates', { withCredentials: true });
      setTemplates(res.data.templates || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === 'create'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('create')}
        >
          Create Email
        </button>
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === 'status'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('status')}
        >
          Email Status & History
        </button>
      </div>

      {activeTab === 'create' ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Promotional Email</h2>
            <form onSubmit={handleSend}>
              <div className="space-y-6">
                {Array.isArray(sections) && sections.length > 0 ? (
                  sections.map((sec, idx) => (
                    <div key={idx} className="border rounded-md p-4 bg-gray-50 relative">
                      <label className="block text-gray-700 font-medium mb-2">
                        Section {idx + 1}
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Write your content here..."
                        value={sec.content}
                        onChange={(e) => handleContentChange(e, idx)}
                        required
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="mt-3 block"
                        onChange={(e) => handleImageChange(e, idx)}
                      />
                      {sec.image && (
                        <div className="mt-2 text-sm text-gray-500">
                          Selected: {sec.image.name}
                        </div>
                      )}
                      <button
                        type="button"
                        className="mt-3 text-red-600 hover:underline text-sm absolute top-4 right-4 disabled:opacity-50"
                        onClick={() => removeSection(idx)}
                        disabled={sections.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No sections available.</div>
                )}
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={addSection}
                >
                  Add Section
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                  disabled={sending}
                >
                  {sending && (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  )}
                  {sending ? "Processing..." : "Send to All Agents"}
                </button>
              </div>
              {successMsg && (
                <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  <div className="font-medium">{successMsg}</div>
                  <div className="text-sm mt-1">
                    ✅ Template created successfully<br/>
                    📧 Emails are being sent in the background<br/>
                    📊 Check the "Email Status & History" tab for progress
                  </div>
                </div>
              )}
              {errorMsg && <div className="mt-6 text-red-600 font-medium">{errorMsg}</div>}
            </form>
          </div>

          {/* Right: Live Preview (Mobile View) */}
          <div className="w-full lg:w-1/2 flex justify-center items-start">
            <div className="w-[370px] min-h-[600px] bg-gray-100 rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-2">
              {/* Simulate mobile device top bar */}
              <div className="h-8 bg-gray-200 flex items-center px-4 border-b border-gray-300">
                <div className="w-16 h-2 bg-gray-400 rounded-full mx-auto"></div>
              </div>
              <div className="p-0">
                <div className="max-w-[370px] mx-auto bg-white rounded-b-2xl overflow-hidden">
                  {Array.isArray(sections) && sections.length > 0 ? (
                    sections.map((sec, idx) => (
                      <div key={idx} className="px-5 py-6 border-b last:border-b-0 border-gray-100">
                        {sec.image && (
                          <PreviewImage file={sec.image} />
                        )}
                        <div className="mt-2 text-gray-800 text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: sec.content.replace(/\n/g, '<br/>') }} />
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-12">No content to preview.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Email Status & History</h2>
          
          {/* Current Email Status */}
          {emailStatus && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Current Email Campaign</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md">
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="text-lg font-semibold">
                    {emailStatus.isCompleted ? (
                      <span className="text-green-600">✅ Completed</span>
                    ) : (
                      <span className="text-blue-600">⏳ Processing...</span>
                    )}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-lg font-semibold">
                    {emailStatus.sendStats.sent + emailStatus.sendStats.failed} / {emailStatus.sendStats.totalRecipients}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${((emailStatus.sendStats.sent + emailStatus.sendStats.failed) / emailStatus.sendStats.totalRecipients) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md">
                  <div className="text-sm text-gray-600">Results</div>
                  <div className="text-sm">
                    <span className="text-green-600">✅ Sent: {emailStatus.sendStats.sent}</span><br/>
                    <span className="text-red-600">❌ Failed: {emailStatus.sendStats.failed}</span>
                  </div>
                </div>
              </div>
              {emailStatus.sendCompletedAt && (
                <div className="mt-4 text-sm text-gray-600">
                  Completed at: {formatDate(emailStatus.sendCompletedAt)}
                </div>
              )}
            </div>
          )}

          {/* Email Templates History */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Email Campaign History</h3>
            {templates.length > 0 ? (
              <div className="space-y-4">
                {templates.map((template, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            template.isCompleted
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {template.isCompleted ? 'Completed' : 'Processing'}
                          </span>
                          <span className="text-sm text-gray-600">
                            Created: {formatDate(template.createdAt)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Total Recipients:</span>
                            <div className="font-semibold">{template.sendStats.totalRecipients}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Sent:</span>
                            <div className="font-semibold text-green-600">{template.sendStats.sent}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Failed:</span>
                            <div className="font-semibold text-red-600">{template.sendStats.failed}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Success Rate:</span>
                            <div className="font-semibold">
                              {template.sendStats.totalRecipients > 0
                                ? `${Math.round((template.sendStats.sent / template.sendStats.totalRecipients) * 100)}%`
                                : '0%'
                              }
                            </div>
                          </div>
                        </div>
                        {template.sendCompletedAt && (
                          <div className="text-xs text-gray-500 mt-2">
                            Completed: {formatDate(template.sendCompletedAt)}
                          </div>
                        )}
                      </div>
                      <button
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        onClick={() => checkEmailStatus(template.templateId)}
                      >
                        Refresh Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg mb-2">📧</div>
                <div>No email campaigns found</div>
                <div className="text-sm">Create your first promotional email campaign!</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Helper for previewing local image before upload
  function PreviewImage({ file }) {
    const [src, setSrc] = React.useState("");
    React.useEffect(() => {
      if (!file) return;
      if (typeof file === "string") {
        setSrc(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setSrc(e.target.result);
      reader.readAsDataURL(file);
      return () => {
        if (src && src.startsWith("blob:")) URL.revokeObjectURL(src);
      };
    }, [file]);
    if (!file) return null;
    return (
      <img
        src={src}
        alt="Section Preview"
        className="w-full rounded-md mb-3 max-h-48 object-cover border"
        style={{ background: '#f3f3f3' }}
      />
    );
  }
}