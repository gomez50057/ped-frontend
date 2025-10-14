import MassiveBase from "@/components/recognition/MassiveBase";
import { municipiosDeHidalgo } from "@/utils/hgomunicipios";

export default function PageReconocimientoMassive() {
  return (
    <main>
      <MassiveBase
        backgroundBasePath="/img/reconocimiento/"
        backgroundOptions={[
          ["Secretaria de edición", "EDUCACIÓN.jpg"],
          ["Instituto Tecnológico Superior del Oriente del Estado de Hidalgo", "ITESA.jpg"],
          ["Instituto Tecnológico Superior Huichapan", "ITESHU.jpg"],
          ["Instituto Tecnológico Superior del Occidente del Estado de Hidalgo", "ITSOEH.jpg"],
          ["Normal Valle del Mezquital", "NVM.jpg"],
          ["Universidad Autónoma del Estado de Hidalgo", "UAEH.jpg"],
          ["Universidad Politécnica de Pachuca", "UPP.jpg"],
          ["Universidad Politécnica de Tulancingo", "UPT.jpg"],
          ["Universidad Tecnológica de Huejotzingo", "UTHH.jpg"],
          ["Universidad Tecnologica Sierra Hidalguense", "UTSH.jpg"],
          ["Universidad Tecnológica de Tula-Tepeji", "UTTT.jpg"],
          ["Universidad Tecnológica del Valle del Mezquital", "UTVM.jpg"],
        ]}
        dateOptions={[
          "2025-10-15",
          "2025-10-16",
          "2025-10-17",
          "2025-10-20",
          "2025-10-21",
          "2025-10-22",
          "2025-10-23",
          "2025-10-24",
          "2025-10-27",
          "2025-10-28",
          "2025-10-29",
          "2025-10-30",
          "2025-10-31"
        ]}
        municipioOptions={municipiosDeHidalgo}
      // Fecha fija en el certificado:
      // dateOptions={[17, 18]}         
      // dateBaseYM="2025-10"    
      />
    </main>
  );
}
