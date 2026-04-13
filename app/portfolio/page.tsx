"use client";

import { useEffect, useState } from 'react';
import './portfolio.css';
import { projectData } from './projects';
import { ChevronDown, Tools, Lightbulb, Trophy, GearFill, Link45deg, Building, Calendar3 } from 'react-bootstrap-icons';

export default function Portfolio() {
  const [data, setData] = useState<{ projects: any[], otherWorks: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true); // 로딩 시작

      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const sortedProjects = [...projectData.projects].sort((a: any, b: any) => {
          const dateA = parseInt(a.period.split(' - ')[0].replace(/\./g, ''));
          const dateB = parseInt(b.period.split(' - ')[0].replace(/\./g, ''));
          return dateB - dateA;
        });

        // 3. 데이터 셋팅
        setData({ 
          projects: sortedProjects, 
          otherWorks: projectData.otherWorks 
        });
        
      } catch (err) {
        console.error("데이터 처리 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 로딩 중일 때 표시 (선택 사항)
  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-80">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        <p className="text-secondary fw-bold">최신 프로젝트를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in">
      <header className="mb-5 text-center">
        <h1 className="fw-bold display-5 mb-3">Project Portfolio</h1>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
          기술로 비즈니스의 제약을 해결하고 가치를 창출한 프로젝트 기록입니다.
        </p>
      </header>

      {/* align-items-start를 추가하여 옆 카드 높이에 영향받지 않게 설정 */}
      <div className="row row-cols-1 row-cols-lg-2 g-4 align-items-start">
        {data?.projects.map((p) => (
          <div className="col" key={p.id}>
            <details className="card border-0 shadow-sm pf-card">
              <summary 
                className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-start" 
                style={{ 
                  cursor: 'pointer', 
                  listStyle: 'none',
                  minHeight: '160px'
                }}
              >
                <div className="me-3 vstack gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3">
                      <Building className="me-1" /> {p.company}
                    </span>
                    <small className="text-muted small"><Calendar3 className="me-1" /> {p.period}</small>
                  </div>
                  <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.1rem' }}>{p.title}</h4>
                  <p className="text-muted mb-0 small">{p.subTitle}</p>
                </div>
                <div className="text-primary mt-1">
                  <ChevronDown size={20} className="pf-chevron" />
                </div>
              </summary>

              <div className="card-body p-4 pt-0 border-top bg-light-subtle">
                {/* 여기가 핵심: CSS에서 height: 450px로 고정됨 */}
                <div className="pf-scroll-area mt-3">
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    {p.tech.map((t: string) => (
                      <span key={t} className="badge bg-white text-dark border fw-normal small">{t}</span>
                    ))}
                  </div>
                  
                  <div className="vstack gap-3">
                    {[
                      { label: '배경', icon: <Tools />, color: 'text-primary', text: p.context },
                      { label: '고민', icon: <Lightbulb />, color: 'text-warning', text: p.challenge },
                      { label: '해결', icon: <GearFill />, color: 'text-info', text: p.solution },
                      { label: '결과', icon: <Trophy />, color: 'text-success', text: p.result }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <h6 className={`fw-bold ${item.color} mb-1 small d-flex align-items-center`}>
                          <span className="me-2">{item.icon}</span> {item.label}
                        </h6>
                        <p className="text-secondary mb-0 ps-4 small" style={{ lineHeight: '1.6' }}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>

      {/* Other Works 섹션 (테이블 구조 유지) */}
      <section className="mt-5 pt-5">
        <h3 className="fw-bold mb-4 d-flex align-items-center">
          <Link45deg className="me-2 text-primary" /> Other Works
        </h3>
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr className="small text-uppercase">
                  <th className="ps-4 py-3">프로젝트</th>
                  <th>기술 스택</th>
                  <th className="text-center">기여도</th>
                </tr>
              </thead>
              <tbody>
                {data?.otherWorks.map((work: any, idx: number) => (
                  <tr key={idx}>
                    <td className="ps-4 py-3 fw-bold">
                      {work.title} 
                      <small className="text-muted ms-2 d-none d-md-inline">| {work.role}</small>
                    </td>
                    <td><span className="text-muted small">{work.tech}</span></td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border px-3">{work.contribution}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}