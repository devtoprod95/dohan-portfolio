import Link from 'next/link';
import { 
  CodeSlash, 
  Database, 
  CloudCheck, 
  ArrowRight 
} from 'react-bootstrap-icons';

export default function Home() {
  const startYear = 2020;
  const currentYear = new Date().getFullYear();
  const careerYears = currentYear - startYear + 1;

  return (
    <div className="pb-0">
      {/* 1. 헤드 섹션 (Hero) */}
      <section className="py-5 text-center bg-dark text-white shadow-lg">
        <div className="container py-5">
          <div className="badge bg-primary mb-3 px-3 py-2 rounded-pill">
            {careerYears}년 차 소프트웨어 엔지니어
          </div>
          <h1 className="display-3 fw-bold mb-3">김도한</h1>
          {/* Hero 섹션의 <p> 태그 부분 */}
          <p className="lead opacity-75 mb-4 mx-auto" style={{ maxWidth: '800px' }}>
            웹 에이전시의 <strong>신속성, 유연함</strong>과 이커머스 플랫폼의 <strong>전문성</strong>을 바탕으로 <br className="d-none d-md-block"/>
            비즈니스 가치를 만드는 안정적인 백엔드 시스템을 구축합니다.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link href="/portfolio" className="btn btn-primary btn-lg px-4 fw-bold">
              프로젝트 보기 <ArrowRight className="ms-2" />
            </Link>
            <Link href="/contact" className="btn btn-outline-light btn-lg px-4">문의하기</Link>
          </div>
        </div>
      </section>

      {/* 중앙 정렬 컨테이너 (모든 섹션의 maxWidth를 동일하게 제한) */}
      <div className="container py-5" style={{ maxWidth: '1000px' }}>
        
        {/* 2. 자기 소개 섹션 */}
        <section className="mb-5 pb-4">
          <h2 className="fw-bold mb-4 border-start border-primary border-4 ps-3">자기 소개</h2>
          <div className="ps-3"> {/* 정렬을 맞추기 위한 내부 패딩 */}
            <p className="text-secondary mb-4 fs-5" style={{ textAlign: 'justify', lineHeight: '1.8' }}>
              웹 에이전시에서의 다양한 프로젝트 수행 경험과 E-commerce 플랫폼에서의 심화 개발 경험을 두루 갖추고 있습니다. 
              현재 <strong>셀러허브(온채널)</strong>에서 멀티채널 상품 및 주문 동기화 시스템의 안정적인 운영을 담당하고 있으며, 
              단순한 기능 구현을 넘어 <strong>데이터 정합성 확보</strong>와 <strong>비즈니스 로직 최적화</strong>를 통해 서비스의 신뢰도를 높이는 데 집중하고 있습니다. 
              나아가 실무 과정에서 발생하는 반복적인 문제를 <strong>자동화</strong>하고, 효율적인 데이터 처리를 위한 기술적 대안을 찾는 과정에 보람을 느낍니다.
            </p>

            <div className="bg-light p-4 rounded-3 border-start border-primary border-5 mb-4">
              <p className="mb-0 text-dark fw-medium">
                "저는 기술이 비즈니스의 제약이 되지 않도록, 지속 가능한 코드를 작성하고 
                운영 효율을 개선하는 데 가치를 둡니다. 맡은 기능이 서비스 전체 흐름에 
                어떤 영향을 주는지 항상 고민하며 주도적으로 업무에 임합니다."
              </p>
            </div>
          </div>
        </section>

        <hr className="my-5 opacity-10" />

        {/* 3. 기술 스택 섹션 */}
        <section className="mb-5 pb-4">
          <h2 className="fw-bold mb-5 border-start border-primary border-4 ps-3">기술 스택</h2>
          <div className="row g-4 ps-2">
            {/* Front-End */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="mb-3 text-primary"><CodeSlash size={32} /></div>
                <h4 className="fw-bold">Front-End</h4>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• React / Next.js 14</li>
                  <li>• Flutter </li>
                  <li>• TypeScript, Vue.js</li>
                  <li>• Tailwind CSS, Bootstrap 5</li>
                </ul>
              </div>
            </div>

            {/* Back-End (강조 색상 유지) */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 text-white bg-primary">
                <div className="mb-3"><Database size={32} /></div>
                <h4 className="fw-bold">Back-End</h4>
                <ul className="list-unstyled small opacity-90 mb-0">
                  <li>• PHP 8.x (Laravel, CI3)</li>
                  <li>• Node.js (NestJS, Express)</li>
                  <li>• Java (Spring Boot 3.x)</li>
                  <li>• MySQL, Redis, Kafka, ELK</li>
                </ul>
              </div>
            </div>

            {/* Infra & DevOps */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="mb-3 text-primary"><CloudCheck size={32} /></div>
                <h4 className="fw-bold">Infra & DevOps</h4>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• AWS (EC2, S3, RDS)</li>
                  <li>• Docker, GitHub Actions</li>
                  <li>• Apache, Nginx</li>
                </ul>
              </div>
            </div>

            {/* Tooling & Collab (추가된 섹션) */}
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="mb-3 text-primary">
                  {/* 부트스트랩 아이콘 중 공유/협업 느낌의 아이콘 사용 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4-3a4 4 0 0 1 1.913-3.376A5.002 5.002 0 0 0 9 12H1c-1 0-1 1-1 1s1 3 4 3h5c.66 0 1.223-.05 1.703-.152z"/>
                  </svg>
                </div>
                <h4 className="fw-bold">Collaboration</h4>
                <ul className="list-unstyled text-muted small mb-0">
                  <li>• Notion, Slack, Jira</li>
                  <li>• Figma, Zeplin</li>
                  <li>• Git (GitLab, GitHub)</li>
                  <li>• Postman, Swagger</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <hr className="my-5 opacity-10" />

        {/* 4. 경력 사항 섹션 */}
        <section className="mb-5 pb-0">
          <h2 className="fw-bold mb-5 border-start border-primary border-4 ps-3">경력 사항</h2>
          <div className="ps-3">
            {[
              { 
                company: '셀러허브(온채널)', 
                period: '2023.05 ~ 재직 중', 
                role: 'Backend Engineer / 이커머스 통합 관리 플랫폼',
                desc: 'Laravel 기반의 대규모 상품/주문 동기화 시스템 운영 및 Kafka를 활용한 데이터 처리'
              },
              { 
                company: '부스터스', 
                period: '2023.01 ~ 2023.04', 
                role: 'Full-stack Developer / D2C 브랜드 통합 관리 및 시장 데이터 분석 플랫폼 구축',
                desc: '주요 판매 채널 데이터 스크래핑 자동화 및 사내 전략 수립을 위한 통합 데이터 시스템 구축'
              },
              { 
                company: '이룸코리아', 
                period: '2022.04 ~ 2022.11', 
                role: 'Full-stack / 기업용 솔루션 개발',
                desc: '해외 명품 브랜드 API와 사내 시스템 간의 데이터 연동 및 상품 관리 자동화 솔루션 구축'
              },
              { 
                company: '한봄스튜디오', 
                period: '2020.01 ~ 2022.03', 
                role: 'Web Developer / 웹 에이전시 프로젝트',
                desc: '공공기관 및 기업 홍보 사이트 등 20여 개 이상의 프로젝트 완수'
              },
            ].map((exp, index) => (
              <div key={index} className="row mb-5">
                <div className="col-md-3">
                  <span className="text-primary fw-bold fs-5">{exp.period}</span>
                </div>
                <div className="col-md-9 border-start ps-4">
                  <h5 className="fw-bold mb-1 fs-4">{exp.company}</h5>
                  <p className="text-dark fw-medium mb-2">{exp.role}</p>
                  <p className="text-secondary mb-0">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}