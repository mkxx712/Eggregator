type IndicatorProps = {
  fng: number;
};
const Indicator = ({ fng }: IndicatorProps) => {
  const getFngCopy = () => {
    if (fng > 50) return "Greed";
    if (fng < 50) return "Fear";
    return "Neutral";
  };
  return (
    <div className="flex flex-col items-center justify-center Otext-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4">
      <p className="text-sm font-medium">{fng}</p>
      <p className="text-sm font-light">{getFngCopy()}</p>
    </div>
  );
};

export default Indicator;
