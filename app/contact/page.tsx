import Image from 'next/image'; // Next.js 이미지 컴포넌트 사용 (권장)
import { Envelope, Github, GeoAlt, Phone } from 'react-bootstrap-icons'; // 아이콘 추가

export default function Contact() {
  const isProd = process.env.NODE_ENV === 'production';
  const prefix = isProd ? '/dohan-portfolio' : '';

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
              <p className="text-primary fw-medium mb-0">Web Engineer(Backend)</p> 
            </div>
          </div>

          {/* 우측 (7/12): 상세 연락처 및 액션 영역 */}
          <div className="col-md-7 p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Contact Me</h2>
              <span className="badge bg-primary rounded-pill">24시간 이내 회신</span>
            </div>
            
            <p className="text-secondary mb-5">
              새로운 프로젝트 제안, 협업 문의, 혹은 저에 대해 더 궁금한 점이 있으시다면 언제든 편하게 연락해 주세요. 성실히 답변 드리겠습니다.
            </p>

            <ul className="list-unstyled mb-0"> {/* mb-5에서 0으로 조정하여 중앙 밸런스 유지 */}
              <li className="d-flex align-items-center mb-4 text-break">
                <Envelope className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Email</strong>
                  <a href="mailto:devtoproduction@gmail.com" className="text-secondary text-decoration-none">
                    devtoproduction@gmail.com
                  </a>
                </div>
              </li>
              
              <li className="d-flex align-items-center mb-4">
                <Phone className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Phone</strong>
                  <a href="tel:010-2546-6499" className="text-secondary text-decoration-none">
                    010-2546-6499
                  </a>
                </div>
              </li>

              <li className="d-flex align-items-center mb-4 text-break">
                <Github className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">GitHub</strong>
                  <a href="https://github.com/devtoprod95" target="_blank" className="text-secondary text-decoration-none">
                    https://github.com/devtoprod95
                  </a>
                </div>
              </li>
              
              <li className="d-flex align-items-center">
                <GeoAlt className="text-primary fs-5 me-3 flex-shrink-0" />
                <div>
                  <strong className="d-block text-dark">Location</strong>
                  <span className="text-secondary">Seoul, South Korea</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}