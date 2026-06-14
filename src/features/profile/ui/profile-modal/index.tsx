"use client";

import { FormEvent, useEffect, useState } from "react";
import { authApi, ApiError } from "@/shared/api/auth/client";
import type { User } from "@/entities/user/model/types";
import { Icon } from "@/shared/ui/icon";
import { Modal } from "@/shared/ui/modal";
import styles from "./index.module.css";

interface ProfileModalProps {
  opened: boolean;
  onClose: () => void;
  user: User;
  onUpdated: (user: User) => void;
  onLogout: () => void;
}

export function ProfileModal({
  opened,
  onClose,
  user,
  onUpdated,
  onLogout,
}: ProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name);
      setEmail(user.email);
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordChange(false);
      setError("");
    }
  }, [opened, user]);

  const saveProfile = async (event?: FormEvent) => {
    event?.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user: updated } = await authApi.updateProfile({
        name,
        email,
        ...(showPasswordChange && newPassword
          ? { password: newPassword, currentPassword }
          : {}),
      });
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось сохранить");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} closeLabel="Закрыть" className={styles.dialog} closable={false}>
      <form className={styles.form} onSubmit={saveProfile}>
        <div className={styles.header}>
          <h2 className={styles.title}>Настройки профиля</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.fields}>
          <label className={styles.field}>
            <span className={styles.label}>Имя пользователя</span>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>E-mail</span>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <div className={styles.divider} />

          {showPasswordChange ? (
            <>
              <label className={styles.field}>
                <span className={styles.label}>Новый пароль</span>
                <input
                  type="password"
                  className={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Текущий пароль</span>
                <input
                  type="password"
                  className={styles.input}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="•••••••••"
                />
              </label>
            </>
          ) : (
            <label className={styles.field}>
              <span className={styles.label}>Текущий пароль</span>
              <input
                type="password"
                className={styles.input}
                value="•••••••••"
                disabled
                readOnly
              />
            </label>
          )}
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => setShowPasswordChange(true)}
          >
            <RefreshIcon />
            Изменить пароль
          </button>
          <button
            type="button"
            className={styles.actionBtnDanger}
            onClick={onLogout}
          >
            <LogoutIcon />
            Выйти из аккаунта
          </button>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CloseIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

function RefreshIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <path
        d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3v5h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 21h5v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

function LogoutIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 17l5-5-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}
