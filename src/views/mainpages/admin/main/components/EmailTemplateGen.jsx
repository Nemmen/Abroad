
import React, { useState } from "react";
import axios from "axios";


export default function EmailTemplateGen() {
  const [sections, setSections] = useState([
    { content: "", image: null }
  ]);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
    try {
      const formData = new FormData();
      sections.forEach((sec, idx) => {
        formData.append(`sections[${idx}][content]`, sec.content);
        if (sec.image) {
          formData.append(`sections[${idx}][image]`, sec.image);
        }
      });
      const res = await axios.post(
        "http://localhost:4000/api/admin/send-promotional-email",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSuccessMsg(res.data.message || "Emails sent!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Sending failed");
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto mt-8">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-8">
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
              {sending ? "Sending..." : "Send to All Agents"}
            </button>
          </div>
          {successMsg && <div className="mt-6 text-green-600 font-medium">{successMsg}</div>}
          {errorMsg && <div className="mt-6 text-red-600 font-medium">{errorMsg}</div>}
        </form>
      </div>

      {/* Right: Live Preview (Mobile View) */}
      <div className="w-full md:w-1/2 flex justify-center items-start">
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