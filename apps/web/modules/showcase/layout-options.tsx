import {SortBy} from "@/types/sortby";
import {cn} from "@/lib/utils";
import {BsLayers} from "react-icons/bs";


export const layoutOptions = [
  {
    value: 'flow',
    label: 'Flow',
    icon: <BsLayers className="h-4 w-4"/>,
    settings: {
      column: 3,
    },
  },
  {
    value: 'grid',
    label: 'Grid',
    icon: <BsLayers className="h-4 w-4"/>,
    settings: {
      column: 3,
      row: 2,
    }
  },
  {
    value: 'single-carousel',
    label: 'Single Carousel',
    icon: <BsLayers className="h-4 w-4"/>,
  },
  {
    value: 'multi-carousel',
    label: 'Multi Carousel',
    icon: <BsLayers className="h-4 w-4"/>,
  },
  {
    value: 'avatar-list',
    label: 'Avatar List',
    icon: <BsLayers className="h-4 w-4"/>,
  },
  {
    value: 'fix-row',
    label: 'Fix Row',
    icon: <BsLayers className="h-4 w-4"/>,
  },
];
