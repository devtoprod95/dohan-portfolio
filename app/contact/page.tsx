import Image from 'next/image'; 
import { Envelope, Github, GeoAlt, Phone, Check2Circle, Mortarboard } from 'react-bootstrap-icons'; // Mortarboard 아이콘 추가

export default function Contact() {
  const isProd = process.env.NODE_ENV === 'production';
  const prefix = isProd ? '/dohan-portfolio' : '';

  const startYear = 2020;
  const currentYear = new Date().getFullYear();
  const careerYears = currentYear - startYear + 1;
  
  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="card shadow-sm border-0 overflow-hidden mx-auto" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">
          
          {/* 좌측 (5/12): 프로필 사진 영역 */}
          <div className="col-md-5 bg-light d-flex align-items-center justify-content-center p-5 border-end">
            <div className="text-center">
              <Image 
                src={`${prefix}/images/dohan.jpeg`}
                alt="Kim Dohan Profile"
                width={400}
                height={400}
                className="img-thumbnail shadow-sm mb-4"
                style={{ objectFit: 'cover' }}
                priority
              />
              <h3 className="fw-bold mb-1">김도한</h3>
              <p className="text-primary fw-medium mb-0">{careerYears}년 차 소프트웨어 엔지니어</p> 
            </div>
          </div>

          {/* 우측 (7/12): 상세 연락처 및 액션 영역 */}
          <div className="col-md-7 p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Contact Me</h2>
              <span className="badge bg-primary rounded-pill">24시간 이내 회신</span>
            </div>
            
            <p className="text-secondary mb-4">
              새로운 프로젝트 제안, 협업 문의, 혹은 저에 대해 더 궁금한 점이 있으시다면 언제든 편하게 연락해 주세요. 성실히 답변 드리겠습니다.
            </p>

            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-center mb-3 text-break">
                <Envelope className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Email</strong>
                  <a href="mailto:devtoproduction@gmail.com" className="text-secondary text-decoration-none">
                    devtoproduction@gmail.com
                  </a>
                </div>
              </li>
              
              <li className="d-flex align-items-center mb-3">
                <Phone className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Phone</strong>
                  <a href="tel:010-2546-6499" className="text-secondary text-decoration-none">
                    010-2546-6499
                  </a>
                </div>
              </li>

              <li className="d-flex align-items-center mb-3 text-break">
                <Github className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">GitHub</strong>
                  <a href="https://github.com/devtoprod95" target="_blank" className="text-secondary text-decoration-none">
                    https://github.com/devtoprod95
                  </a>
                </div>
              </li>
              
              {/* 학력 사항 추가 */}
              <li className="d-flex align-items-center mb-3">
                <Mortarboard className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Education</strong>
                  <span className="text-secondary">신구대학교 컴퓨터공학과 졸업</span>
                </div>
              </li>

              <li className="d-flex align-items-center mb-3 text-break">
                <GeoAlt className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Location</strong>
                  <span className="text-secondary">Seoul, South Korea</span>
                </div>
              </li>

              {/* 병역사항 */}
              <li className="d-flex align-items-center">
                <Check2Circle className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Military Service</strong>
                  <span className="text-secondary">
                    육군 병장 만기전역 (26사단 조교)
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}