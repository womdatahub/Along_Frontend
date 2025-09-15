import { LogoIcon } from "@public/svgs";
import Link from "next/link";

type Props = { path?: string; withoutLink?: boolean };
export const LogoComponent = ({ path, withoutLink }: Props) => {
  if (withoutLink) {
    return <LogoIcon />;
  }
  return (
    <Link href={path ? path : "/"}>
      <LogoIcon />
    </Link>
  );
};
