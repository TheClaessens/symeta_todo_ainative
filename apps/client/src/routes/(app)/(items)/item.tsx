import React from 'react';
import { getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/app/items/$itemId');

const Item = () => {
  const { itemId } = route.useParams();

  return <div>Item {itemId}</div>;
};

export default Item;
