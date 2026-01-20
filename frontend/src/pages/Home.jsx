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
  const [error, setError] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    setLoading(true);
    setError(null);
    api.get("/api/notes/")
      .then(res => {
        console.log("Full API Response:", res);
        console.log("Response Data:", res.data);
        
        // Handle different response structures
        let notesData = [];
        
        if (Array.isArray(res.data)) {
          // Case 1: Direct array
          notesData = res.data;
          console.log("Direct array received");
        } 
        else if (res.data && Array.isArray(res.data.results)) {
          // Case 2: Paginated response {results: [...]}
          notesData = res.data.results;
          console.log("Paginated response received");
        }
        else if (res.data && Array.isArray(res.data.data)) {
          // Case 3: Wrapped in data property {data: [...]}
          notesData = res.data.data;
          console.log("Data-wrapped response received");
        }
        else if (typeof res.data === 'object' && res.data !== null) {
          // Case 4: Try to extract any array from object
          for (const key in res.data) {
            if (Array.isArray(res.data[key])) {
              notesData = res.data[key];
              console.log(`Found array in property: ${key}`);
              break;
            }
          }
        }
        
        console.log("Final notes data:", notesData);
        setNotes(notesData);
      })
      .catch(err => {
        console.error("API Error:", err);
        console.error("Error response:", err.response?.data);
        setError("Failed to load notes. Please try again.");
        setNotes([]); // Ensure notes is always an array
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createNote = (e) => {
    e.preventDefault();
    api.post("/api/notes/", { title, content })
      .then(() => {
        resetForm();
        getNotes();
      })
      .catch(err => {
        console.error("Create error:", err);
        alert("Failed to create note");
      });
  };

  const updateNote = (e) => {
    e.preventDefault();
    api.put(`/api/notes/update/${selectedNote.id}/`, { title, content })
      .then(() => {
        resetForm();
        getNotes();
      })
      .catch(err => {
        console.error("Update error:", err);
        alert("Failed to update note");
      });
  };

  const deleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      api.delete(`/api/notes/delete/${id}/`)
        .then(() => getNotes())
        .catch(err => {
          console.error("Delete error:", err);
          alert("Failed to delete note");
        });
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

  // Safe render function for notes
  const renderNotes = () => {
    // Ensure notes is always an array
    const safeNotes = Array.isArray(notes) ? notes : [];
    
    if (safeNotes.length === 0) {
      return (
        <div className="p-8 text-center">
          <div className="text-gray-400 text-5xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700">No notes found</h3>
          <p className="text-gray-500 mt-2">Create your first note to get started!</p>
        </div>
      );
    }

    return (
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
            {safeNotes.map((note, index) => (
              <tr key={note.id || index} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-4 px-6 text-gray-600 font-medium">{index + 1}</td>
                <td className="py-4 px-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">{note.title || 'Untitled'}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content || 'No content'}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    (note.status === 'Active' || !note.status)
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {note.status || 'Active'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {note.updated_at 
                    ? new Date(note.updated_at).toLocaleDateString()
                    : 'N/A'
                  }
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
    );
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

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
          ) : (
            renderNotes()
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;