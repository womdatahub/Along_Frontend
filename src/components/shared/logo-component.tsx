import { LogoIcon, LogoIcon2 } from "@public/svgs";
import Link from "next/link";

type Props = { path?: string; withoutLink?: boolean; type2?: boolean };
export const LogoComponent = ({ path, withoutLink, type2 }: Props) => {
  if (withoutLink) {
    return type2 ? <LogoIcon2 /> : <LogoIcon />;
  }
  return (
    <Link href={path ? path : "/"}>{type2 ? <LogoIcon2 /> : <LogoIcon />}</Link>
  );
};
