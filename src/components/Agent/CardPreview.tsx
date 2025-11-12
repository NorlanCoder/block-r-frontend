import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { apiUrlBase } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface CardPreviewProps {
  militant: any;
}

const CardPreview: React.FC<CardPreviewProps> = ({ militant }) => {
  const app = useSelector((state: RootState) => state.appReducer);
  
  // Formatage du numéro de carte avec padding à 6 chiffres
  const formatCardNumber = (num: string | number | undefined): string => {
    if (!num) return "000000";
    const numStr = String(num);
    return numStr.padStart(6, "0");
  };

  // Récupération des noms depuis les IDs
  const communeName = app.communes.find((c) => String(c.code_com) === String(militant.commune_id))?.lib_com || "";
  const departementName = app.departements.find((d) => String(d.code_dep) === String(militant.departement_id))?.lib_dep || "";
  const circonscriptionName = app.circonscriptions.find((c) => String(c.code_circ) === String(militant.circonscription_id))?.lib_circ || "";

  // Génération du contenu du QR code (identique au PHP)
  const qrCodeValue = `${militant.reference_carte || formatCardNumber(militant.reference_carte)}|${militant.nom || ""}|${militant.prenom || ""}|${circonscriptionName}|${communeName}|https://www.pepsup.com/login`;

  // Numéro de carte formaté
  const numCarteFormat = formatCardNumber(militant.reference_carte);

  return (
    <div className="flex items-center justify-center m-14">
      <div
        id="card-preview"
        className="card-preview relative"
        style={{
          width: "86mm",
          height: "54mm",
          background: "#1ccccc",
          border: "1px solid #000",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
          margin: 0,
          padding: 0,
          position: "relative",
        }}
      >
        {/* QR Code positionné absolument comme dans le PHP */}
        <div
          style={{
            position: "absolute",
            top: "40mm",
            left: "35mm",
            backgroundColor: "#FFFFFF",
            border: "none",
            width: "10mm",
            height: "10mm",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <QRCodeSVG
            value={qrCodeValue}
            size={100}
            level="L"
            bgColor="#FFFFFF"
            fgColor="#000000"
            style={{ width: "10mm", height: "10mm" }}
          />
        </div>

        {/* Table structure comme dans le PHP */}
        <table
          style={{
            width: "100%",
            height: "100%",
            border: "0",
            borderCollapse: "collapse",
            margin: 0,
            padding: 0,
          }}
        >
          <tbody>
            <tr>
              {/* Colonne gauche avec les informations */}
              <td
                style={{
                  width: "70%",
                  rowSpan: 2,
                  paddingLeft: "15px",
                  lineHeight: "13px",
                  paddingTop: "48px",
                  fontSize: "8px",
                  letterSpacing: "2px",
                  verticalAlign: "top",
                }}
              >
                {/* Nom */}
                <span style={{ marginTop: "1px", fontSize: "10px" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{militant.nom || ""}
                </span>
                <br />
                {/* Prénom */}
                <span style={{ marginTop: "2px", fontSize: "10px" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{militant.prenom || ""}
                </span>
                <br />
                {/* Profession */}
                <span style={{ marginTop: "3px", fontSize: "10px" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{militant.profession || ""}
                </span>
                <br />
                {/* Adresse */}
                <span style={{ marginTop: "5px", fontSize: "10px" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{militant.adresse || ""}
                </span>
                <br />
                {/* Circonscription */}
                <span style={{ marginTop: "7px", fontSize: "9px" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{circonscriptionName}
                </span>
                <br />
                {/* Commune / Département */}
                <span style={{ fontSize: "9px", marginTop: "8px" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{communeName}/{departementName}
                </span>
                <br />
                {/* Contact */}
                <span style={{ fontSize: "10px", marginTop: "9px" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;00229 {militant.telephone || ""}
                </span>
                <br />
              </td>
              {/* Colonne droite - Numéro de carte */}
              <td
                align="center"
                style={{
                  paddingTop: "13px",
                  fontSize: "10px",
                }}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{numCarteFormat}
              </td>
            </tr>
            <tr>
              {/* Colonne droite - Photo */}
              <td
                width=""
                align="center"
                valign="top"
                style={{
                  paddingTop: "7px",
                  paddingBottom: "20px",
                  paddingLeft: "1px",
                  paddingRight: "1px",
                }}
              >
                <img
                  src={militant.photo ? (typeof militant.photo === 'string' && militant.photo.startsWith('http') ? militant.photo : apiUrlBase + militant.photo) : "/default-avatar.png"}
                  alt="Photo"
                  style={{
                    width: "70px",
                    height: "auto",
                    maxWidth: "70px",
                    border: "1px solid black",
                    objectFit: "cover",
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardPreview;
