export default function WriteupSection() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Writeup</h2>
        <p className="text-slate-500">
          Full written analysis with methodology, derivations, and results.
        </p>
      </div>
      <iframe
        src="/writeup.pdf"
        style={{ width: '100%', height: '85vh' }}
        className="rounded-xl border border-slate-200"
        title="Project Writeup"
      />
    </div>
  );
}
