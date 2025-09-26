import React from "react";
import { apiUrlBase } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaCircle, FaFileAlt, FaHome, FaInfoCircle, FaLocationArrow, FaMapPin, FaPhone, FaUser } from "react-icons/fa";

interface CardPreviewProps {
  militant: any; // tu peux remplacer par MilitantType si tu veux typé fort
}

const CardPreview: React.FC<CardPreviewProps> = ({ militant }) => {
    console.log(militant)
    const app = useSelector((state: RootState) => state.appReducer);
  return (
    <div className="flex items-center justify-center m-14">
        <div
            id="card-preview"
            className="card-preview relative border rounded shadow-md bg-white flex flex-row justify-between p-4 py-5"
            style={{
                width: "86mm",
                height: "54mm",
                border: "1px solid #000",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            }}
        >
            <div className="text-gray-600" style={{ width: "80%", maxWidth: "80%" }}>
                <div className="flex mb-2 gap-2 items-center">
                    <FaUser className="mr-2 w-3" />
                    <h3 className="text-sm font-bold">{militant.nom} {militant.prenom}</h3>
                </div>
                <div className="flex mb-2 gap-2 items-center">
                    <FaLocationArrow className="mr-2 w-3" />
                    <p className="text-[11px]">Fédération: {app.departements.find((d) => d.code_dep === militant.departement_id)?.lib_dep}</p>
                </div>
                <div className="flex mb-2 gap-2 items-center">
                    <FaCircle className="mr-2 w-3" />
                    <p className="text-[11px]">Comité: {app.circonscriptions.find((c) => c.code_circ === militant.circonscription_id)?.lib_circ}</p>
                </div>
                <div className="flex mb-2 gap-2 items-center">
                    <FaFileAlt className="mr-2 w-2" />
                    <p className="text-[11px]">Section: {app.communes.find((s) => s.code_com === militant.commune_id)?.lib_com}</p>
                </div>
                <div className="flex mb-2 gap-2 items-center">
                    <FaHome className="mr-2 w-3" />
                    <p className="text-[11px]"> {militant.adresse}</p>
                </div>
                <div className="flex mb-2 gap-2 items-center">
                    <FaPhone className="mr-2 w-3" />
                    <p className="text-[11px]">{militant.telephone}</p>
                </div>
            </div>
            <div>
                <div>
                    <img
                        style={{ width: "80px", height: "95px", border: "1px solid #000", objectFit: "cover" }}
                        src={militant.photo ? apiUrlBase + militant.photo : "/default-avatar.png"}
                        alt="Photo"
                        width={80}
                        height={95}
                        className="mb-2"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default CardPreview;
