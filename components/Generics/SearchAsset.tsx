import axios, { CancelTokenSource } from "axios";
import React, { FC, SyntheticEvent, useState } from "react";
import SelectItem from "./SelectItem";
import { ICoinsLite } from "@coingecko/cg-api-ts";
import { Asset } from "../../utils/types";

const SearchAsset: FC<{ setAsset: (a: Asset) => void; asset?: Asset }> = ({ setAsset, asset }) => {
  const [openSelectAsset, setOpenSelectAsset] = useState(false);

  const [searchAsset, setSearchAsset] = useState<{
    query: string;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    results: any;
    loading: boolean;
    message: string;
    selected: boolean;
  }>({
    query: "",
    results: [],
    loading: false,
    message: "",
    selected: false,
  });
  const [cancelSearch] = useState<CancelTokenSource | undefined>();

  const handleOnSearchChange = (event: SyntheticEvent): void => {
    const { value } = event.target as HTMLInputElement;
    const query = value;
    if (!query) {
      setSearchAsset({ ...searchAsset, query, results: {}, message: "", selected: false });
    } else {
      setSearchAsset({ ...searchAsset, query, loading: true, message: "", selected: false });
      fetchSearchResults(query);
    }
  };

  const fetchSearchResults = (query: string): void => {
    // By default the limit of results is 20
    const searchUrl = `https://api.coingecko.com/api/v3/coins`;
    if (cancelSearch) {
      // Cancel the previous request before making a new request
      cancelSearch?.cancel();
    }
    // Create a new CancelToken
    const cancel = axios.CancelToken.source();
    axios
      .get(searchUrl, {
        cancelToken: cancel.token,
      })
      .then((res) => {
        const resultNotFoundMsg = !res.data.length
          ? "There are no more search results. Please try a new search."
          : "";
        setSearchAsset({
          ...searchAsset,
          results: res.data.filter(
            (c: ICoinsLite) =>
              c.symbol.includes(query.toLowerCase()) ||
              c.name.toLowerCase().includes(query.toLowerCase()),
          ),
          message: resultNotFoundMsg,
          loading: false,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error) || error) {
          setSearchAsset({
            ...searchAsset,
            loading: false,
            message: "Failed to fetch results.Please check network",
          });
        }
      });
  };

  const selectAsset = (event: SyntheticEvent, cgAsset: ICoinsLite) => {
    event.preventDefault();
    setAsset({
      ...asset,
      name: cgAsset.name,
      ticker: cgAsset.symbol,
      icon: cgAsset.image.large,
      currentPrice: cgAsset.market_data.current_price,
      cgId: cgAsset.id,
    });
    setSearchAsset({
      ...searchAsset,
      query: cgAsset.name,
      selected: true,
    });
    setOpenSelectAsset(!openSelectAsset);
  };

  const { results, query, message, loading, selected } = searchAsset;

  return (
    <div className="form-input">
      <label>Asset *</label>
      <div className="relative">
        <input
          className="w-full bg-white"
          value={selected ? query : undefined}
          placeholder="Search assets..."
          onFocus={() => setOpenSelectAsset(true)}
          onBlur={() => setOpenSelectAsset(false)}
          onChange={handleOnSearchChange}
        />
        {openSelectAsset ? (
          <div
            onBlur={() => setOpenSelectAsset(false)}
            className="absolute shadow-lg bg-white top-100 z-40 w-full left-0"
          >
            <div className="relative max-h-60 overflow-y-scroll">
              {Object.keys(results).length && results.length
                ? results?.map((asset: ICoinsLite) => {
                    return (
                      <div
                        key={asset.id}
                        onMouseDown={(e: SyntheticEvent): void => selectAsset(e, asset)}
                      >
                        <SelectItem
                          icon={asset.image.large}
                          title={asset.name}
                          subtitle={asset.symbol.toUpperCase()}
                        />
                      </div>
                    );
                  })
                : null}
              {/*Error Message*/}
              {message ? <p className="m-4 text-sm">{message}</p> : null}
              {/*Loader*/}
              {loading ? <span className="donutSpinner" /> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchAsset;
