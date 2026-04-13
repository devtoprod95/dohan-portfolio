"use client";
import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // @ts-ignore: Bootstrap은 타입 정의가 까다로울 수 있어 임시로 ignore 처리
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null; // 화면에 아무것도 그리지 않음
}