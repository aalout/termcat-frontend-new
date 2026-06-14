"use client";

import type { User } from "@/entities/user/model/types";
import { getInitials } from "@/shared/lib/get-initials";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/logo";
import { ModeSegment } from "@/shared/ui/mode-segment";
import { ProfileDropdown } from "@/features/profile/ui/profile-dropdown";
import { Icon } from "@/shared/ui/icon";
import styles from "./index.module.css";

interface HeaderProps {
  user: User;
  onHistoryClick: () => void;
  onUserUpdated: (user: User) => void;
}

export function Header({ user, onHistoryClick, onUserUpdated }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo />
        <div className={styles.nav}>
          <ModeSegment />
          <Button
            variant="secondary"
            size="small"
            className={styles.historyBtn}
            leftIcon={<HistoryIcon />}
            onClick={onHistoryClick}
          >
            История
          </Button>
        </div>
      </div>

      <ProfileDropdown
        user={user}
        onUserUpdated={onUserUpdated}
        triggerClassName={styles.avatar}
        initials={getInitials(user.name)}
      />
    </header>
  );
}

function HistoryIcon() {
  return (
    <Icon size={16} viewBox="0 0 24 24">
      <path
        d="M12 8v4l3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.05 11a9 9 0 1 1 .5 4"
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
    </Icon>
  );
}
