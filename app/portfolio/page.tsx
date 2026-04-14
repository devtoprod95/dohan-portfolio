"use client";

import { useEffect, useState } from 'react';
import './portfolio.css';
import { projectData } from './projects';
import { ChevronDown, Tools, Lightbulb, Trophy, GearFill, Link45deg, Building, Calendar3 } from 'react-bootstrap-icons';

export default function Portfolio() {
  const [data, setData] = useState<{ projects: any[], otherWorks: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openProjectIds, setOpenProjectIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false); // 💡 렌더링 준비 완료 플래그

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const sortedProjects = [...projectData.projects].sort((a, b) => {
          const dateA = parseInt(a.period.split(' - ')[0].replace(/\./g, ''));
          const dateB = parseInt(b.period.split(' - ')[0].replace(/\./g, ''));
          return dateB - dateA;
        });

        setData({ projects: sortedProjects, otherWorks: projectData.otherWorks });

        // 💡 [핵심] 출력용 페이지일 때
        if (typeof window !== 'undefined' && window?.location?.pathname.includes('/pdf-full')) {
          const allIds = sortedProjects.map((p: any) => p.id);
          setOpenProjectIds(allIds);

          // 💡 [추가] 리액트 렌더링 후 실제 DOM 요소들에 open 속성 강제 주입
          setTimeout(() => {
            const detailsElements = document.querySelectorAll('details.pf-card');
            detailsElements.forEach((el) => {
              el.setAttribute('open', 'true');
            });
          }, 1000); // 렌더링 완료 시간을 벌어줌
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggle = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const isMobile = window.innerWidth < 992;

    setOpenProjectIds(prev => {
      if (prev.includes(id)) {
        // 이미 열려있으면 닫기
        return prev.filter(pId => pId !== id);
      } else {
        // 모바일이면 기존 거 다 닫고 이것만 열기, PC면 기존 거 유지하고 추가
        return isMobile ? [id] : [...prev, id];
      }
    });
  };

  const isOpen = (id: string) => openProjectIds.includes(id);

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
    <div className={`container py-5 ${isReady ? 'pdf-ready' : ''}`}>
      <header className="mb-5 text-center">
        <h1 className="fw-bold display-5 mb-3">Project Portfolio</h1>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
          기술로 비즈니스의 제약을 해결하고 가치를 창출한 프로젝트 기록입니다.
        </p>
      </header>

      {/* align-items-start를 추가하여 옆 카드 높이에 영향받지 않게 설정 */}
      <div className="row row-cols-1 row-cols-lg-2 g-4 align-items-start">
        {data?.projects.map((p) => {
          
          return (
            <div className="col" key={p.id}>
              <details className="card border-0 shadow-sm pf-card" open={isOpen(p.id)}>
                <summary 
                  className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-start" 
                  style={{ cursor: 'pointer', listStyle: 'none', minHeight: '160px', height: '160px' }}
                  onClick={(e) => handleToggle(e, p.id)}
                >
                  <div className="me-2 me-md-3 vstack gap-1 gap-md-2" style={{ flex: 1, minWidth: 0 }}>
                    {/* 상단 뱃지 & 날짜 영역 */}
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span 
                        className="badge rounded-pill border px-2 px-md-3 py-1 d-inline-flex align-items-center" 
                        style={{ 
                          fontSize: '0.75rem',
                          backgroundColor: p.bg || '#f8f9fa', // 데이터에 없으면 기본 회색
                          color: p.text || '#6c757d',
                          borderColor: p.text ? `${p.text}40` : '#dee2e6', // 텍스트색에 투명도 25%(40)를 섞어 테두리 생성
                          borderStyle: 'solid',
                          borderWidth: '1px'
                        }}
                      >
                        <Building className="me-1" /> {p.company}
                      </span>
                      <small className="text-muted small d-flex align-items-center" style={{ fontSize: '0.7rem' }}>
                        <Calendar3 className="me-1" /> {p.period}
                      </small>
                    </div>

                    {/* 제목 (h4) */}
                    <h4 className={`fw-bold mb-0 text-dark ${isOpen(p.id) ? 'title-open' : 'title-responsive'}`} 
                        style={{ 
                          fontSize: 'calc(0.9rem + 0.2vw)', 
                          lineHeight: '1.4'
                        }}>
                      {p.title}
                    </h4>

                    {/* 부제목도 마찬가지로 적용하고 싶다면 동일한 방식으로 클래스 부여 */}
                    <p className={`text-muted mb-0 mt-1 ${isOpen(p.id) ? 'title-open' : 'title-responsive'}`} 
                      style={{ 
                        fontSize: '0.85rem',       // 0.75에서 0.85로 상향 (가독성 확보)
                        lineHeight: '1.5',         // 줄 간격을 살짝 넓혀서 빽빽함 해소
                        color: '#6c757d',          // text-muted보다 아주 살짝 진한 회색 권장
                        letterSpacing: '-0.02em'   // 글자 간격을 미세하게 좁혀서 세련된 느낌 추가
                      }}
                    >
                      {p.subTitle}
                    </p>

                  </div>

                  {/* 아이콘 영역: 제목과 겹치지 않게 고정 폭 유지 */}
                  <div className="text-primary mt-1 ms-2 flex-shrink-0">
                    <ChevronDown size={18} className="pf-chevron" />
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
          )

        })}
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