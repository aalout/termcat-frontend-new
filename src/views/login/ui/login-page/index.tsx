import { LoginForm } from "@/features/auth/ui/login-form";
import styles from "./index.module.css";

export function LoginPage() {
  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  );
}
