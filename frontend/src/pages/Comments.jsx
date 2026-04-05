import { useState } from "react";
import { MessageSquare, Download, RefreshCw, ThumbsUp, Flag } from "lucide-react";

function Comments() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [loading, setLoading] = useState(false);
  const [filterSentiment, setFilterSentiment] = useState("all");

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const comments = [
    { id: 1, author: "John Doe", text: "Great tutorial! Very helpful and easy to follow.", sentiment: "positive", likes: 245, date: "2024-01-15" },
    { id: 2, author: "Jane Smith", text: "Could you explain this part more? I didn't understand.", sentiment: "neutral", likes: 12, date: "2024-01-15" },
    { id: 3, author: "Mike Johnson", text: "This is exactly what I was looking for. Thanks!", sentiment: "positive", likes: 189, date: "2024-01-14" },
    { id: 4, author: "Sarah Williams", text: "Not very clear. Disappointed with the explanation.", sentiment: "negative", likes: 5, date: "2024-01-14" },
    { id: 5, author: "Tom Brown", text: "Amazing content! Keep it up!", sentiment: "positive", likes: 342, date: "2024-01-13" },
  ];

  const sentimentStats = [
    { sentiment: "Positive", count: 1245, percentage: 68, color: "bg-green-500" },
    { sentiment: "Neutral", count: 420, percentage: 23, color: "bg-gray-500" },
    { sentiment: "Negative", count: 165, percentage: 9, color: "bg-red-500" },
  ];

  const filteredComments = filterSentiment === "all" 
    ? comments 
    : comments.filter(c => c.sentiment === filterSentiment);

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case "positive": return "bg-green-100 text-green-800";
      case "negative": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch(sentiment) {
      case "positive": return "😊";
      case "negative": return "😞";
      default: return "😐";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💬 Comments</h1>
          <p className="text-gray-600 mt-2">Comment analysis with sentiment detection</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {["last7days", "last30days", "last90days"].map((period) => (
          <button
            key={period}
            onClick={() => setTimeRange(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === period
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {period.replace("last", "").replace("days", "d")}
          </button>
        ))}
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {sentimentStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.sentiment}</p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900">{stat.count}</h3>
              </div>
              <span className="text-3xl">{stat.sentiment === "Positive" ? "😊" : stat.sentiment === "Negative" ? "😞" : "😐"}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${stat.color} h-2 rounded-full`}
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{stat.percentage}% of comments</p>
          </div>
        ))}
      </div>

      {/* Sentiment Distribution Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Sentiment Distribution</h2>
        <div className="flex items-end justify-center gap-8 h-64">
          {sentimentStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-20 bg-gray-200 rounded-t-lg relative group">
                <div
                  className={`w-20 ${stat.color} rounded-t-lg transition-all hover:opacity-80`}
                  style={{ height: `${(stat.percentage / 100) * 200}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {stat.percentage}%
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 font-medium">{stat.sentiment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterSentiment("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterSentiment === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Comments
        </button>
        <button
          onClick={() => setFilterSentiment("positive")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterSentiment === "positive"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Positive
        </button>
        <button
          onClick={() => setFilterSentiment("neutral")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterSentiment === "neutral"
              ? "bg-gray-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Neutral
        </button>
        <button
          onClick={() => setFilterSentiment("negative")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterSentiment === "negative"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Negative
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {comment.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{comment.author}</p>
                  <p className="text-xs text-gray-500">{comment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(comment.sentiment)}`}>
                  {getSentimentEmoji(comment.sentiment)} {comment.sentiment}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{comment.text}</p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <ThumbsUp size={16} />
                <span>{comment.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                <Flag size={16} />
                <span>Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Comment Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">😊 Positive Sentiment</p>
            <p className="text-sm text-gray-600 mt-2">68% of comments are positive - great audience engagement!</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">💬 Top Comments</p>
            <p className="text-sm text-gray-600 mt-2">Focus on comments with high engagement for community building</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-900">⚠️ Negative Feedback</p>
            <p className="text-sm text-gray-600 mt-2">Address negative comments to improve content quality</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comments;
