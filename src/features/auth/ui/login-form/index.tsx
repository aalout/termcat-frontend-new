"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, ApiError } from "@/shared/api/auth/client";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import styles from "./index.module.css";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("alexey@termcat.ru");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.login({ email, password });
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div className={styles.logoMark} aria-hidden />
        <h1 className={styles.title}>TermCAT</h1>
        <p className={styles.subtitle}>Войдите, чтобы анализировать термины</p>
      </div>

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <Input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />

      {error ? <p className={styles.error}>{error}</p> : null}

      <Button type="submit" variant="gradient" disabled={loading} className={styles.submit}>
        {loading ? "Вход…" : "Войти"}
      </Button>

      <p className={styles.hint}>alexey@termcat.ru / demo123</p>
    </form>
  );
}
