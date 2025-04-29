import { Button, ButtonProps } from "./button"

interface ButtonShadowProps extends ButtonProps {
  size?: "default" | "sm" | "lg" | "icon" | null; 
  color?: string;
  border?: string;
  shadow?: string;
  rounded?: "default" | "rounded-sm" | "rounded-lg" | "rounded-full" | null;
  fontSize?: string;
  fontWeight?: string;
  fontColor?: string;
  height?: string;
  width?: string;
  margin?: string;
  position?: string;
  top?: string;
  right?: string;
  transform?: string;
}

function ButtonShadow({
  children,
  size = "default",
  width = "default",
  color = "bg-blue-400 text-black",
  border = "border-2 border-black",
  shadow = "shadow-[6px_6px_0px_#000]",
  rounded = "default",
  fontSize = "text-lg",
  fontWeight = "font-semibold",
  fontColor = "text-black",
  height = "h-10",
  margin = "mt-2",
  position = "relative",
  top = "top-1/2",
  right = "right-2",
  transform = "-translate-y-1/2",
  ...props
}: ButtonShadowProps) {

  return (
    <Button 
      className={`group relative ${size}  ${width} ${fontSize} ${fontWeight} ${fontColor} ${border} ${rounded} ${color} ${shadow} ${height} transition-all duration-200 ease-in-out hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-[0px_0px_0px_#000] active:scale-95`}
      {...props}
    >
      {children}
    </Button>
  )
}

export default ButtonShadow
