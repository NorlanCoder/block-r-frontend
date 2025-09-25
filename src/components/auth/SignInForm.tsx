import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { login } from "../../api/auth";
import toast, { LoaderIcon } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginauth } from "../../store/slices/authSlice";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide.";
    if (!password) newErrors.password = "Le mot de passe est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await login(email, password);
      if(!response.user) {
        if(response.code == "nonoctive") toast.error("Votre compte a été restreint. Veuillez réessayer.");
        else toast.error("Identifiants invalides. Veuillez réessayer.");
      }
      else {
        dispatch(loginauth({token: response.access_token, user: response.user}));
        toast.success("Connexion reussie.")
        setTimeout(() => {
          navigate("/");
        }, 2000);
      };
      setErrors({});
    } catch (err) {
      setErrors({ password: "Identifiants invalides." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        {/* <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link> */}
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Connexion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrer vos identifiants pour vous connecter
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input name="email" value={email} onChange={handleEmailChange} placeholder="info@gmail.com" />
                  {errors.email && (
                    <div className="text-error-500 text-xs mt-1">{errors.email}</div>
                  )}
                </div>
                <div>
                  <Label>
                    Mot de passe <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <div className="text-error-500 text-xs mt-1">{errors.password}</div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span> */}
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div>
                  <Button disabled={loading} onClick={() => handleSubmit} className="w-full" size="sm">
                    {
                      loading ? (
                        <span className="flex items-center gap-2">
                          <LoaderIcon className="fill-white size-5" />
                        </span>
                      ) : (
                        <>
                          <span>Connexion</span>
                        </>
                      )
                    }
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Vous n'avez pas de compte ? {""}
                <Link
                  to="/inscription"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Créer un compte agent
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
