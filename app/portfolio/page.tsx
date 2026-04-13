const projects = [
  { id: 1, title: "OnChannel Admin", desc: "이커머스 통합 관리 플랫폼", tech: "Laravel" },
  { id: 2, title: "Dailypharm Survey", desc: "의약 전문 설문 시스템", tech: "React & TS" },
];

export default function Portfolio() {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Portfolio</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {projects.map((p) => (
          <div className="col" key={p.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text text-muted">{p.desc}</p>
                <span className="badge bg-primary">{p.tech}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}