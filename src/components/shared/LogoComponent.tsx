import { LogoIcon } from "@public/svgs";
import Link from "next/link";

type Props = { path?: string };
export const LogoComponent = ({ path }: Props) => {
  return (
    <Link href={path ? path : "/"}>
      <LogoIcon />
    </Link>
  );
};
