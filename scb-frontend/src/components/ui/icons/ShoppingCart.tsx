import * as React from "react";
import type { SVGProps } from "react";
const SvgShoppingCart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 28"
    fill="currentColor"
    width="1em"
    height="1em"
    className={props.className}
    {...props}
  >
    <switch>
      <g>
        <path d="M20.94 19h-8.88c-1.38 0-2.58-.94-2.91-2.27L7.03 8.24A1 1 0 0 1 8 7h17a1.003 1.003 0 0 1 .97 1.24l-2.12 8.48A2.995 2.995 0 0 1 20.94 19M9.28 9l1.81 7.24c.11.45.51.76.97.76h8.88c.46 0 .86-.31.97-.76L23.72 9z" />
        <path d="M8 9c-.46 0-.86-.31-.97-.76L6.22 5H3c-.55 0-1-.45-1-1s.45-1 1-1h4c.46 0 .86.31.97.76l1 4A1 1 0 0 1 8 9M11 25c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2M22 25c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2" />
      </g>
    </switch>
  </svg>
);
export default SvgShoppingCart;
