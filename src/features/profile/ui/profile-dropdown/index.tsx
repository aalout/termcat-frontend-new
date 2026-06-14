"use client";

import { useRouter } from "next/navigation";
import type { User } from "@/entities/user/model/types";
import { authApi } from "@/shared/api/auth/client";
import { Icon } from "@/shared/ui/icon";
import { Dropdown } from "@/shared/ui/dropdown";
import { ProfileModal } from "@/features/profile/ui/profile-modal";
import { useState } from "react";
import styles from "./index.module.css";

interface ProfileDropdownProps {
  user: User;
  onUserUpdated: (user: User) => void;
  initials: string;
  triggerClassName?: string;
}

export function ProfileDropdown({
  user,
  onUserUpdated,
  initials,
  triggerClassName,
}: ProfileDropdownProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await authApi.logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      <Dropdown
        align="right"
        open={menuOpen}
        onOpenChange={setMenuOpen}
        trigger={
          <span className={[styles.avatar, triggerClassName].filter(Boolean).join(" ")}>
            {initials}
          </span>
        }
        contentClassName={styles.menuWrap}
      >
        <div className={styles.menu}>
          <div className={styles.userInfo}>
            <p className={styles.name}>{user.name}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
          <div className={styles.divider} />
          <button
            type="button"
            className={styles.menuItem}
            onClick={() => {
              setMenuOpen(false);
              setProfileOpen(true);
            }}
          >
            <UserIcon />
            Профиль
          </button>
          <button type="button" className={styles.menuItemDanger} onClick={handleLogout}>
            <LogoutIcon />
            Выйти
          </button>
        </div>
      </Dropdown>

      <ProfileModal
        opened={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onUpdated={onUserUpdated}
        onLogout={handleLogout}
      />
    </>
  );
}

function UserIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 20v-1a6 6 0 0 1 12 0v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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
