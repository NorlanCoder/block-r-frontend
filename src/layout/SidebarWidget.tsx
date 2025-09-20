import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api/auth";
import { logout } from "../store/slices/authSlice";

export default function SidebarWidget() {
  const auth = useSelector((state: any) => state.authReducer);
  const dispatch = useDispatch()

  const handleLogout = async () => {
    const response = await logoutUser(auth.token);
    if (response) {
      dispatch(logout())
    }
  };

  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <button
        onClick={handleLogout}
        className="flex items-center w-full justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Déconnexion
      </button>
    </div>
  );
}
