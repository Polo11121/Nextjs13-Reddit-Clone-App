"use client";

import { useEffect, useRef } from "react";
import { useSearch } from "@/actions/useSearch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const SearchBar = () => {
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const {
    search,
    searchHandler,
    data: searchResults,
    isFetched,
    setSearch,
  } = useSearch();

  useOnClickOutside(commandRef, () => setSearch(""));

  useEffect(() => setSearch(""), [pathname, setSearch]);

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        value={search}
        onValueChange={searchHandler}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />
      {search.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {Boolean(searchResults?.length) && (
            <CommandGroup heading="Communities">
              {searchResults?.map(({ id, name }) => {
                const selectHandler = (value: string) => {
                  router.push(`/r/${value}`);
                  router.refresh();
                };

                return (
                  <CommandItem
                    className="cursor-pointer hover:opacity-80"
                    value={name}
                    key={id}
                    onSelect={selectHandler}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <a href={`/r/${name}`}>r/{name}</a>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
};
