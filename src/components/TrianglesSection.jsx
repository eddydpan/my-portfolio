import TrianglesBackground from './TrianglesBackground';

export default function TrianglesSection() {
  return (
    <section className="h-32 py-4 bg-gray-100 relative flex items-center justify-center overflow-hidden">
      {/* Triangles Animation - spread more horizontally */}
      <TrianglesBackground 
        count={12} 
        orientation="horizontal"
        height="100%"
        spreadX={{ min: 0, max: 100 }}
        spreadY={{ min: 20, max: 80 }}
      />
    </section>
  );
}
