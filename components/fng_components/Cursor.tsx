type CursorProps = {
  normalizedAngle: number;
};

const Cursor = ({ normalizedAngle }: CursorProps) => {
  return (
    <div
      style={{
        transform: `rotate(${normalizedAngle}deg)`,
        transformOrigin: "51px 8px",
      }}
      className="h-4 w-4 rounded-full bg-gray-700 border-2 border-white absolute top-[37px] left-[-6.5px]"
    />
  );
};

export default Cursor;
