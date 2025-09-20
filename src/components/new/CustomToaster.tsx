import { Toaster } from "react-hot-toast";

const CustomToast = () => {
    return (
    <Toaster
        containerStyle={{
            top: 0, 
            right: 0,
            bottom: "auto",
            padding: 0,
            margin: 0,
        }}
    >
        {(t) => (
            <div
            className={`${
                t.visible ? "animate-enter" : "animate-leave"
            } flex w-screen items-center justify-between px-4 py-6 shadow-md z-[9999]`}
            style={{
                background:
                t.type === "success"
                    ? "#dcfce7"
                    : t.type === "error"
                    ? "#fee2e2"
                    : "#fef9c3",
                color: "black",
                zIndex: 999999,
                margin: 0,
            }}
            >
            <div className="mx-auto max-w-6xl flex-1">
                {String(t.message)}
            </div>
            <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-4 text-gray-500 hover:text-gray-700"
            >
                ✕
            </button>
            </div>
        )}
    </Toaster>
    );
};

export default CustomToast;
