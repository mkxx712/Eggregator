import { Separator } from "@/components/ui/separator"

const etherscan_api = process.env.ETHERSCAN_API;

export async function Gas() {
      const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&gasprice=2000000000&apikey=' + etherscan_api);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const slow = data["result"]["SafeGasPrice"];
        const standard = data["result"]["ProposeGasPrice"];
        const fast = data["result"]["FastGasPrice"];
    return (
        <div className="flex h-5 mt-4 items-center space-x-6 text-sm">
          <div><div className="font-medium">Slow:</div> {slow} </div>
          <Separator orientation="vertical" />
          <div><div className="font-medium">Standard:</div> {standard}</div>
          <Separator orientation="vertical" />
          <div><div className="font-medium">Fast: </div> {fast}</div>
        </div>
    )
  }
