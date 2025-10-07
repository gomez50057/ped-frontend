// app/reconocimiento/page.jsx
import RecognitionWindowGate from "@/components/recognition/RecognitionWindowGate";
import BaseStudents from "@/components/recognition/BaseStudents";
import { municipiosDeHidalgo } from "@/utils/hgomunicipios";

const START = process.env.NEXT_PUBLIC_RECOG_START_ISO;
const END = process.env.NEXT_PUBLIC_RECOG_END_ISO;
const TZ = process.env.NEXT_PUBLIC_RECOG_TZ ?? "America/Mexico_City";

export default function PageReconocimiento() {
  return (
    <main>
      <RecognitionWindowGate startISO={START} endISO={END} tz={TZ}>
        <BaseStudents
          backgroundSrc="/img/reconocimiento/certificado-bg.jpg"
          dateOptions={[29, 30, "2025-10-01"]}
          dateBaseYM="2025-09"
          municipioOptions={municipiosDeHidalgo}
        />
      </RecognitionWindowGate>
    </main>
  );
}
