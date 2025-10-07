import MassiveBase from "@/components/recognition/MassiveBase";
import { municipiosDeHidalgo } from "@/utils/hgomunicipios";


export default function PageReconocimientoMassive() {
  return (
    <main>
      <MassiveBase
        backgroundSrc="/img/reconocimiento/certificado-bg.jpg"
        dateOptions={["2025-09-29", "2025-09-30", "2025-10-01"]}
        municipioOptions={municipiosDeHidalgo}
        // Fecha fija en el certificado:
        // dateOptions={[17, 18]}         
        // dateBaseYM="2025-10"           

      />
    </main>
  );
}
