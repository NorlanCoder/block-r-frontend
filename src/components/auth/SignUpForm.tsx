import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import toast from "react-hot-toast";
import { registerUser } from "../../api/auth";
import { useDispatch } from "react-redux";
import { loginauth } from "../../store/slices/authSlice";
// import { register } from "../../api/auth"; // Décommente si tu as une fonction d'API

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // États pour chaque champ
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("+229 01");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fname) newErrors.fname = "Le prénom est requis.";
    if (!lname) newErrors.lname = "Le nom est requis.";
    if (!email) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide.";
    if (!telephone) newErrors.telephone = "Le téléphone est requis.";
    if (!password) newErrors.password = "Le mot de passe est requis.";
    else if (password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    if (!confirmPassword) newErrors.confirmPassword = "La confirmation est requise.";
    else if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await registerUser(fname, lname, email, telephone, password);
      if (response.user) {
        dispatch(loginauth({token: response.access_token, user: response.user}));
        toast.success("Inscription réussie !");
        setTimeout(() => {
          navigate("/");
        }, 2000);
        // Redirige ou autre action
      } else {
        toast.error("Erreur lors de l'inscription.");
      }
      setErrors({});
    } catch (err) {
      setErrors({ email: "Erreur lors de l'inscription." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Inscription
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Remplissez le formulaire pour créer un compte agent
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Prénoms */}
                  <div className="sm:col-span-1">
                    <Label>
                      Prénoms<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Entrer vos prénoms"
                      value={fname}
                      onChange={e => setFname(e.target.value)}
                    />
                    {errors.fname && (
                      <div className="text-error-500 text-xs mt-1">{errors.fname}</div>
                    )}
                  </div>
                  {/* Nom */}
                  <div className="sm:col-span-1">
                    <Label>
                      Nom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Entrer votre nom"
                      value={lname}
                      onChange={e => setLname(e.target.value)}
                    />
                    {errors.lname && (
                      <div className="text-error-500 text-xs mt-1">{errors.lname}</div>
                    )}
                  </div>
                </div>
                {/* Email */}
                <div>
                  <Label>
                    E-mail<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Entrer l'email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="text-error-500 text-xs mt-1">{errors.email}</div>
                  )}
                </div>
                {/* Téléphone */}
                <div>
                  <Label>
                    Téléphone<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="telephone"
                    id="telephone"
                    name="telephone"
                    placeholder="Entrer numéro de telephone"
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                  />
                  {errors.telephone && (
                    <div className="text-error-500 text-xs mt-1">{errors.telephone}</div>
                  )}
                </div>
                {/* Mot de passe */}
                <div>
                  <Label>
                    Mot de passe<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Mot de passe"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
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
                {/* Confirmation mot de passe */}
                <div>
                  <Label>
                    Confirmation mot de passe<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Confirmer mot de passe"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
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
                  {errors.confirmPassword && (
                    <div className="text-error-500 text-xs mt-1">{errors.confirmPassword}</div>
                  )}
                </div>
                {/* Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  >
                    {loading ? "Création en cours..." : "Créer un compte"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Vous avez déjà un compte?{" "}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}