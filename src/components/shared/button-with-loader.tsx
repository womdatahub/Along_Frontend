import { Button, ButtonProps } from "../ui";
import { BtnLoader } from "./btn-loader";

type Props = ButtonProps & {
  isLoading: boolean;
  text: string;
};
const ButtonWithLoader = (props: Props) => {
  return (
    <Button disabled={props.isLoading} {...props}>
      <BtnLoader isLoading={props.isLoading}>{props.text}</BtnLoader>
    </Button>
  );
};
export { ButtonWithLoader };
