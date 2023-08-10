import { useCallback, useState } from "react";
import { Prisma, Subreddit } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import axios from "axios";

export const useSearch = () => {
  const [search, setSearch] = useState("");

  const { refetch, ...rest } = useQuery({
    queryFn: async () => {
      if (!search) {
        return [];
      }

      const { data } = await axios.get(`/api/search?q=${search}`);

      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const request = debounce(() => refetch(), 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const searchHandler = (text: string) => {
    setSearch(text);
    debounceRequest();
  };

  return {
    ...rest,
    search,
    searchHandler,
    setSearch,
  };
};
