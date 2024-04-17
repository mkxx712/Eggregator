import Gauge from "@/components/fng_components/Gauge";
import Indicator from "@/components/fng_components/Indicator";
import Cursor from "@/components/fng_components/Cursor";

const Fng = async () => {
  const fngFetch = await fetch("https://api.alternative.me/fng/", {
    next: { revalidate: 3600 },
  });

  const fngData = await fngFetch.json();
  const fng = fngData.data[0].value;

  const normalizeAngle = (value: number) => {
    const maxValue = 100;
    const minAngle = 0;
    const maxAngle = 180;
    const normalizedAngle = (value * (maxAngle - minAngle)) / maxValue + minAngle;
    return normalizedAngle;
  };

  const normalizedAngle = normalizeAngle(fng);

  return (
    <main className="flex max-h-screen flex-col items-center space-y-10 p-0">
      <div className="flex justify-center items-center rounded-d" style={{ background: "none" }}>
        <div className="relative">
          <Cursor normalizedAngle={normalizedAngle} />
          <Indicator fng={fng} />
          <Gauge />
        </div>
      </div>
    </main>
  );
};

export default Fng;
