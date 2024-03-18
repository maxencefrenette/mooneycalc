"use client";

import React from "react";
import {
  MarketContext,
  type Markets,
  usePercentileMarket3Days,
} from "~/services/market";
import { SettingsForm } from "./settings-form";
import { ActionsDataTable } from "./actions-table";

export interface ActionsPageProps {
  markets: Markets;
}

const ActionsPage = ({ markets }: ActionsPageProps) => {
  const query = usePercentileMarket3Days();

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  const { p10, p90 } = query.data!;

  const allMarkets = {
    ...markets,
    p10,
    p90,
  };

  return (
    <MarketContext.Provider value={allMarkets}>
      <SettingsForm />
      <ActionsDataTable />
    </MarketContext.Provider>
  );
};

export default ActionsPage;
