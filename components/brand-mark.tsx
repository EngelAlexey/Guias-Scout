import Image from "next/image";

const RATIO = 960 / 1067;

type Props = {
  height?: number;
  onDark?: boolean;
  priority?: boolean;
  className?: string;
};

export function BrandMark({
  height = 46,
  onDark = false,
  priority = false,
  className,
}: Props) {
  const width = Math.round(height * RATIO);

  return (
    <span
      className={[
        "brand-mark",
        onDark ? "brand-mark--on-dark" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src="/logo.webp"
        alt=""
        width={width}
        height={height}
        priority={priority}
      />
    </span>
  );
}
