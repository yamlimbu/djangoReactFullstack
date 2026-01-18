import { useState, useEffect } from "react";
import api from "../api.js";

function Home() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    setLoading(true);
    api.get("/api/notes/")
      .then(res => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch(err => {
        alert(err);
        setLoading(false);
      });
  };

  const createNote = (e) => {
    e.preventDefault();
    api.post("/api/notes/", { title, content }).then(() => {
      resetForm();
      getNotes();
    });
  };

  const updateNote = (e) => {
    e.preventDefault();
    api.put(`/api/notes/update/${selectedNote.id}/`, { title, content }).then(() => {
      resetForm();
      getNotes();
    });
  };

  const deleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      api.delete(`/api/notes/delete/${id}/`).then(() => getNotes());
    }
  };

  const editNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📝 Notes Management</h1>
            <p className="text-gray-600 mt-2">Manage all your notes in one place</p>
          </div>
          
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? "Cancel" : "+ Create New Note"}
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isEditing ? "✏️ Edit Note" : "📝 Create New Note"}
            </h2>
            <form onSubmit={isEditing ? updateNote : createNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Enter note content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow hover:shadow-lg"
                >
                  {isEditing ? "Update Note" : "Save Note"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700">No notes found</h3>
              <p className="text-gray-500 mt-2">Create your first note to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Title & Content</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {notes.map((note, index) => (
                    <tr key={note.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-4 px-6 text-gray-600 font-medium">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div>
                          <h3 className="font-semibold text-gray-900">{note.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          note.status === 'Active' || !note.status
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {note.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(note.updated_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editNote(note)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;