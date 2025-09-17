import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Bloc Républicain - Connexion"
        description="Page de connexion agent Bloc Républicain"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
