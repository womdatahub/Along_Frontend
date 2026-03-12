import { Button, ButtonProps } from "../ui";
import { BtnLoader } from "./btn-loader";

type Props = ButtonProps & {
  isLoading: boolean;
  text: string;shouldChildrenShowWhenSpinning?: boolean
};
const ButtonWithLoader = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rest = (({ isLoading, text, shouldChildrenShowWhenSpinning, ...rest }) => rest)(props);
  return (
    <Button disabled={props.isLoading} {...rest}>
      <BtnLoader isLoading={props.isLoading} shouldChildrenShowWhenSpinning={props.shouldChildrenShowWhenSpinning}>{props.text}</BtnLoader>
    </Button>
  );
};
export { ButtonWithLoader };
