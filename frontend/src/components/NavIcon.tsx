type NavIconName =
  | "home"
  | "exercise"
  | "routine"
  | "workout"
  | "progress";

type NavIconProps = {
  name: NavIconName;
};

function NavIcon({
  name
}: NavIconProps) {
  if (name === "home") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M3 10.5 12 3l9 7.5"
        />
        <path
          d="M5.5 9.5V21h13V9.5"
        />
        <path
          d="M9.5 21v-6h5v6"
        />
      </svg>
    );
  }

  if (name === "exercise") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M6 9v6" />
        <path d="M3.5 10v4" />
        <path d="M18 9v6" />
        <path d="M20.5 10v4" />
        <path d="M6 12h12" />
      </svg>
    );
  }

  if (name === "routine") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />

        <path d="m3.5 6 1 1 2-2" />
        <path d="m3.5 12 1 1 2-2" />
        <path d="m3.5 18 1 1 2-2" />
      </svg>
    );
  }

  if (name === "workout") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
        />

        <path d="M12 8v4l3 2" />
        <path d="M8 3.5 6.5 2" />
        <path d="M16 3.5 17.5 2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V3" />
    </svg>
  );
}

export default NavIcon;