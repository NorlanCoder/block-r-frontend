import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Bloc Républicain - Inscription"
        description="Page d'inscription agent Bloc Républicain"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
