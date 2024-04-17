"use client";

import * as React from "react";

import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CiSquareRemove } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface EXSwitcherProps extends PopoverTriggerProps {}

export default function EXSwitcher({ className }: EXSwitcherProps) {
  const [groups, setGroups] = React.useState([
    {
      label: "Total",
      teams: [
        {
          label: "Total",
          value: "Total",
        },
      ],
    },
    {
      label: "DEX/Wallet",
      teams: [
        {
          label: "0xb9BC82DE634D0D0cC439e2f27ADB90B97c4Cb0d4",
          value: "MetaMask",
        },
      ],
    },
    {
      label: "CEX",
      teams: [
        {
          label: "Binance - Wilson",
          value: "Binance",
        },
        {
          label: "Coinbase - Wilson",
          value: "Coinbase",
        },
        {
          label: "OKX - Wilson",
          value: "OKX",
        },
      ],
    },
  ]);

  const defaut_switcher = groups[0]["teams"][0];
  type GroupType = typeof groups;
  type EX = GroupType[number]["teams"][number];
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<EX>(defaut_switcher);
  const [api, setApi] = React.useState(""); // Add Status Maintenance API
  const [apiSecret, setApiSecret] = React.useState(""); // Add status maintenance API_SECRET
  const [exchanges, setExchanges] = React.useState([]); // Specify the type of exchanges as an array of EX type objects
  const [portfolioName, setPortfolioName] = React.useState("");
  const [showAddressInput, setShowAddressInput] = React.useState(false); // Show the address input field when the user selects DEX/Wallet

  const handleSubmit = async () => {
    if (portfolioName) {
      setSelectedTeam(prevState => ({
        ...prevState,
        label: portfolioName, // Prioritize the use of portfolioName as a tag
      }));
    }

    // Determine whether DEX/Wallet or CEX based on the value of selectedTeam.
    const targetGroupLabel = ["Ethereum", "Polygon", "MetaMask"].includes(selectedTeam.value) ? "DEX/Wallet" : "CEX";

    // Find the index of the target group
    const targetGroupIndex = groups.findIndex(group => group.label === targetGroupLabel);

    if (targetGroupIndex !== -1) {
      const newTeam = {
        label: portfolioName || selectedTeam.label, // Use portfolioName as the label, if the user does not enter a portfolioName, use selectedTeam.label
        value: selectedTeam.value, // Here we assume that value is a unique identifier, e.g. "0x123".
        api: api,
        apiSecret: apiSecret,
      };

      // Update the teams array of the target group
      const updatedGroups = [...groups];
      updatedGroups[targetGroupIndex].teams.push(newTeam);

      setGroups(updatedGroups);
    }

    const response = await fetch("/api/api_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        portfolioName,
        api,
        apiSecret,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("Failed to save data");
    }

    console.log("selectedTeam Name:", selectedTeam);
    // Close the dialog and clear the form
    setShowNewTeamDialog(false);
    setApi("");
    setApiSecret("");
    setPortfolioName("");
  };

  const handleSelectChange = (selectedValue: string) => {
    setSelectedTeam({
      label: portfolioName || selectedValue, // Selected label name
      value: selectedValue, // Here we assume that label and value are the same
    });

    // When MetaMask is selected, the address input box is displayed.
    setShowAddressInput(selectedValue === "MetaMask");
  };

  const handleRemoveTeam = (groupIndex: number, teamIndex: number): void => {
    if (groupIndex === 0 && teamIndex === 0) {
      toast.warn("Cannot remove the 'Total'", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].teams.splice(teamIndex, 1);
    setGroups(updatedGroups);
  };

  const getLogoUrl = (teamLabel: string) => {
    // console.log("Getting logo URL for:", teamLabel);
    switch (teamLabel) {
      case "Binance":
        return "https://avatars.githubusercontent.com/u/69836600?s=200&v=4";
      case "Coinbase":
        return "https://avatars.githubusercontent.com/u/1885080?s=280&v=4";
      case "OKX":
        return "https://avatars.githubusercontent.com/u/120148534?s=200&v=4";
      case "MetaMask":
        return "https://avatars.githubusercontent.com/u/11744586?s=200&v=4";
      case "Polygon":
        return "https://avatars.githubusercontent.com/u/66309068?s=200&v=4";
      case "Ethereum":
        return "https://avatars.githubusercontent.com/u/6250754?s=200&v=4";
      default:
        return `https://avatar.vercel.sh/${teamLabel}.png`; // Use the default label as the avatar URL
    }
  };

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="comb0xb9BC82DE634D0D0cC439e2f27ADB90B97c4Cb0d5obox"
            aria-expanded={open}
            aria-label="Select"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage src={getLogoUrl(selectedTeam.value)} alt={selectedTeam.value} className="grayscale" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {/* {selectedTeam.label} */}
            <span className="truncate w-32">{selectedTeam.label}</span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              {groups.map((group, groupIndex) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team, teamIndex) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <Avatar className="mr-2 h-5 w-5">
                            <AvatarImage src={getLogoUrl(team.value)} alt={team.value} className="grayscale" />
                            <AvatarFallback>SC</AvatarFallback>
                          </Avatar>
                          <span className="truncate w-32">{team.label}</span>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation(); // Prevent onSelect event from being triggered
                            handleRemoveTeam(groupIndex, teamIndex);
                          }}
                          className="ml-2 text-gray-500 hover:text-gray-300"
                          aria-label="Remove"
                        >
                          <CiSquareRemove className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>

            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Import
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Exchange/Address</DialogTitle>
          <DialogDescription>Import a new exchange/address to manage products and customers.</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="portfolioName">Portfolio name</Label>
              <Input
                id="portfolioName"
                placeholder="Suggestion : (CEX/DEX/Wallet) - (Name, Easy For Identification)"
                value={portfolioName}
                onChange={e => setPortfolioName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Exchange/Address</Label>
              <Select onValueChange={value => handleSelectChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MetaMask">
                    <span className="font-medium">MetaMask</span> -{" "}
                    <span className="text-muted-foreground">On-chain</span>
                  </SelectItem>
                  {/* <SelectItem value="Ethereum">
                    <span className="font-medium">Ethereum</span> -{" "}
                    <span className="text-muted-foreground">
                      On-chain
                    </span>
                  </SelectItem>
                  <SelectItem value="Polygon">
                    <span className="font-medium">Polygon</span> -{" "}
                    <span className="text-muted-foreground">
                      On-chain
                    </span>
                  </SelectItem> */}
                  {/* <SelectItem value="Coinbase">
                    <span className="font-medium">Coinbase</span> -{" "}
                    <span className="text-muted-foreground">
                      CEX
                    </span>
                  </SelectItem> */}
                  <SelectItem value="Binance">
                    <span className="font-medium">Binance</span> - <span className="text-muted-foreground">CEX</span>
                  </SelectItem>
                  {/* <SelectItem value="OKX">
                    <span className="font-medium">OKX</span> -{" "}
                    <span className="text-muted-foreground">
                      CEX
                    </span>
                  </SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            {/* Show API and API_SECRET input boxes when MetaMask is unchecked */}
            {!showAddressInput && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="api">API</Label>
                  <Input id="api" placeholder="Input Your API Key" value={api} onChange={e => setApi(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API_SECRET</Label>
                  <Input
                    id="apiSecret"
                    placeholder="Input Your API Secret"
                    value={apiSecret}
                    onChange={e => setApiSecret(e.target.value)}
                  />
                </div>
              </>
            )}
            {/* Display address input box only when MetaMask is selected */}
            {showAddressInput && (
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Input Your Address"
                  value={apiSecret}
                  onChange={e => setApiSecret(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
