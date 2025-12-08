import * as React from "react";
import type { SVGProps } from "react";
const SvgHide = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
    width="1em"
    height="1em"
    className={props.className}
    {...props}
  >
    <g fill="#000" fillRule="evenodd" clipRule="evenodd">
      <path d="M24.761 15.264a.75.75 0 0 1 1.025.272l2.863 4.938a.75.75 0 0 1-1.298.752L24.49 16.29a.75.75 0 0 1 .272-1.025M19.145 17.924a.75.75 0 0 1 .869.608l.887 5.038a.75.75 0 0 1-1.477.26l-.888-5.037a.75.75 0 0 1 .609-.87M12.842 17.911a.75.75 0 0 1 .61.869l-.888 5.05a.75.75 0 0 1-1.478-.26l.888-5.05a.75.75 0 0 1 .868-.609M7.225 15.263a.75.75 0 0 1 .275 1.024L4.637 21.25a.75.75 0 1 1-1.3-.75L6.2 15.538a.75.75 0 0 1 1.025-.275" />
      <path d="M3.529 12.529a.75.75 0 0 1 1.055.112C6.6 15.14 10.257 18.25 16 18.25s9.4-3.111 11.417-5.609a.75.75 0 0 1 1.166.943C26.402 16.286 22.358 19.75 16 19.75S5.6 16.286 3.417 13.584a.75.75 0 0 1 .112-1.055" />
    </g>
  </svg>
);
export default SvgHide;
