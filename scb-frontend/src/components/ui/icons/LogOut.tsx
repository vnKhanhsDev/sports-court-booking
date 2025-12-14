import * as React from "react";
import type { SVGProps } from "react";
const SvgLogOut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 682.667 682.667"
    fill="currentColor"
    width="1em"
    height="1em"
    className={props.className}
    {...props}
  >
    <defs>
      <clipPath id="b" clipPathUnits="userSpaceOnUse">
        <path d="M0 512h512V0H0Z" />
      </clipPath>
    </defs>
    <mask id="a">
      <rect width="100%" height="100%" fill="#fff" />
    </mask>
    <g mask="url(#a)">
      <g clipPath="url(#b)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
        <path
          d="M0 0v-40c0-33.137-26.863-60-60-60h-201c-33.137 0-60 26.863-60 60v352c0 33.137 26.863 60 60 60h201c33.137 0 60-26.863 60-60v-40"
          style={{
            fill: "none",
            stroke: "#000",
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(341 120)"
        />
        <path
          d="M0 0h-271"
          style={{
            fill: "none",
            stroke: "#000",
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(487 255)"
        />
        <path
          d="m0 0 44.786 44.787c11.716 11.716 11.716 30.71 0 42.426L0 132"
          style={{
            fill: "none",
            stroke: "#000",
            strokeWidth: 40,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(438.427 189)"
        />
      </g>
    </g>
  </svg>
);
export default SvgLogOut;
