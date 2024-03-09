"use client";

import React from "react";
import { MarketContext, type Markets } from "~/services/market";
import { SettingsForm } from "./settings-form";
import { ActionsDataTable } from "./actions-table";

export interface ActionsPageProps {
  markets: Markets;
}

const ActionsPage = ({ markets }: ActionsPageProps) => {
  return (
    <MarketContext.Provider value={markets}>
      <SettingsForm />
      <ActionsDataTable />
    </MarketContext.Provider>
  );
};

export default ActionsPage;
