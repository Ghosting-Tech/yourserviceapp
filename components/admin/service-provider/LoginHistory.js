const TABLE_HEAD = ["Event Type", "Timestamp"];

export default function LoginHistory({ history = [] }) {
  return (
    <div className="w-full max-h-96 bg-white rounded-lg overflow-auto shadow-sm border border-gray-200">
      {/* Table Header */}
      <div className="flex bg-gray-300 text-gray-700 py-3 px-6">
        {TABLE_HEAD.map((head) => (
          <div key={head} className="w-1/2 text-left text-sm font-medium">
            {head}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {history.map(({ eventType, timestamp }, index) => (
          <div
            key={timestamp}
            className="flex hover:bg-gray-100 transition duration-200 py-3 px-6"
          >
            <div className="w-1/2 text-sm text-gray-600">{eventType}</div>
            <div className="w-1/2 text-sm text-gray-500">{timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
