export default function Home() {
  return (
    <div>
      <section className="py-5 text-center bg-light">
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-3">안녕하세요, 김도한입니다.</h1>
          <p className="lead text-secondary mb-4">
            복잡한 문제를 단순한 코드로 해결하는 것을 즐기는 <br/>
            <strong>풀스택 소프트웨어 엔지니어</strong>입니다.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a href="/portfolio" className="btn btn-primary btn-lg px-4 gap-3">프로젝트 보기</a>
            <a href="/contact" className="btn btn-outline-secondary btn-lg px-4">문의하기</a>
          </div>
        </div>
      </section>
      
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4 text-center">
            <h3>Frontend</h3>
            <p>React, Next.js, Bootstrap</p>
          </div>
          <div className="col-md-4 text-center">
            <h3>Backend</h3>
            <p>NestJS, Laravel, MySQL</p>
          </div>
          <div className="col-md-4 text-center">
            <h3>DevOps</h3>
            <p>AWS, GitHub Actions</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
