import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { itemName } from "~/services/items";
import { useMarket } from "~/services/market";

export interface ItemDetailProps {
  hrid: string;
}

export const ItemDetail = ({ hrid }: ItemDetailProps) => {
  const market = useMarket();
  const name = itemName(hrid);

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>{name}</HoverCardTrigger>
      <HoverCardContent side="right" sideOffset={16}>
        <h3 className="pb-1 text-muted-foreground">{name}</h3>
        <p>Ask: {market.market[name]?.ask}</p>
        <p>Bid: {market.market[name]?.bid}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ItemDetail;
