export default function Description({ sections = [] }) {
  return (
    <div className="space-y-8">
      {Array.isArray(sections) ? sections.map((section, index) => (
        <div key={index}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{section.header}</h2>
          <p className="text-gray-600 text-lg">{section.content}</p>
        </div>
      )) : null}
    </div>
  );
}
