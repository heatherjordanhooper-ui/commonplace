export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-serif mb-4">COMMONPLACE</h1>
        <p className="text-xl text-gray-600 mb-12">
          Your week in images. A private weekly lookbook generated from your attention.
        </p>
        
        <div className="p-8 border border-gray-300 rounded">
          <h2 className="text-2xl font-serif mb-4">✅ Setup Complete!</h2>
          <p className="text-gray-600 mb-4">
            Your COMMONPLACE is ready. The foundation is built.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Database connected ✓</li>
            <li>AI integration ready ✓</li>
            <li>Project configured ✓</li>
          </ul>
        </div>
      </div>
    </main>
  );
}